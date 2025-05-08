import { readFileSync } from 'fs';
import pool from '../src/lib/db.js';

(async () => {
  try {
    const client = await pool.connect();
    const sql = readFileSync(new URL('./init_db.sql', import.meta.url), 'utf8');
    await client.query(sql);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    pool.end();
  }
})();