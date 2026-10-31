import pool from './db.js';

const sql = `
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_url TEXT NOT NULL,
  solution     INTEGER NOT NULL,
  user_answer  INTEGER,
  is_correct   BOOLEAN,
  status       VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending | solved | failed
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  answered_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_user ON game_sessions(user_id);
`;

await pool.query(sql);
console.log('Database schema initialized.');
await pool.end();
