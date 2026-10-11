import pg from 'pg';
import { env } from './env.js';
export const pool = new pg.Pool({ connectionString: env.DATABASE_URL, ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : false, max: 10 });
