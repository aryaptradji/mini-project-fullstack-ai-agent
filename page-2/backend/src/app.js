import express from 'express';
import { readFile } from 'node:fs/promises';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { env } from './config/env.js';
import { pool } from './config/database.js';
import productRoutes from './routes/product.routes.js';
import { requestId } from './middlewares/request-id.js';
import { errorHandler } from './middlewares/error-handler.js';
export const app = express();

const here = dirname(fileURLToPath(import.meta.url));
const spec = YAML.parse(await readFile(new URL('./schemas/openapi.yaml', import.meta.url), 'utf8'));

app.disable('x-powered-by');
app.use(requestId);
app.use((req, res, next) => {
    const origin = req.get('origin');
    if (origin === env.FRONTEND_ORIGIN) {
        res.set('Access-Control-Allow-Origin', origin);
        res.set('Vary', 'Origin'); res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type,X-Request-Id');
    } if (req.method === 'OPTIONS') return res.sendStatus(origin === env.FRONTEND_ORIGIN ? 204 : 403);
    next();
});
app.use(express.json({ limit: '1mb', strict: true }));
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => console.log(JSON.stringify({ level: 'info', requestId: req.id, method: req.method, path: req.path, status: res.statusCode, durationMs: Date.now() - start })));
    next();
});
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/ready', async (_req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ready', database: 'ok' });
    } catch {
        res.status(503).json({ status: 'not_ready', database: 'unavailable' });
    }
});
app.get('/openapi.json', (_req, res) => res.json(spec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
app.use('/assets', express.static(resolve(here, '../../frontend/assets'), { fallthrough: false, maxAge: env.NODE_ENV === 'production' ? '1d' : 0 }));
app.use('/api/products', productRoutes);
app.use((req, res, next) => {
    const e = new Error('The requested resource was not found.');
    e.status = 404; next(e);
});
app.use((err, req, res, next) => {
    if (err.code === '23505' || err.code === '23514') {
        err.status = 400;
        err.title = 'Validation Error';
        err.message = 'Input conflicts with a product constraint.';
        err.errors = [{ field: 'body', message: 'Value conflicts with a uniqueness or database constraint.' }];
    } 
    errorHandler(err, req, res, next);
});
