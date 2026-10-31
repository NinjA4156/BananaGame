import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'banana_game',
  password: process.env.PGPASSWORD || '',
  port: Number(process.env.PGPORT) || 5432,
});

export default pool;
