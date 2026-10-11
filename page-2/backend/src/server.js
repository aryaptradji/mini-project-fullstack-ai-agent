import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => console.log(JSON.stringify({ level: 'info', message: 'API listening', port: env.PORT, environment: env.NODE_ENV })));
async function shutdown() { server.close(async () => { const { pool } = await import('./config/database.js'); await pool.end(); }); }
process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown);
