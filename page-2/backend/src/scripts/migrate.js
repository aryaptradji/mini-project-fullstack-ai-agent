import { readFile } from 'node:fs/promises';
import { pool } from '../config/database.js';
const sql = await readFile(new URL('../../migrations/001_schema.sql', import.meta.url), 'utf8');
try { await pool.query(sql); console.log('Migrations complete'); } finally { await pool.end(); }
