import { Router } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'banana_dev_secret';
const BANANA_API = 'https://marcconrad.com/uob/banana/api.php';

// Middleware: require a valid token
export function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Login required.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
}

// GET /api/game/question — fetch a new banana puzzle (solution stays server-side)
router.get('/question', auth, async (req, res) => {
  try {
    const r = await fetch(BANANA_API);
    const data = await r.json();
    if (!data.question || typeof data.solution !== 'number') {
      return res.status(502).json({ error: 'Banana API returned an invalid response.' });
    }

    const result = await pool.query(
      `INSERT INTO game_sessions (user_id, question_url, solution)
       VALUES ($1, $2, $3) RETURNING id, question_url, status, created_at`,
      [req.user.id, data.question, data.solution]
    );
    const session = result.rows[0];
    res.json({ sessionId: session.id, questionUrl: session.question_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch a question. Try again.' });
  }
});

// POST /api/game/answer — check the player's guess
router.post('/answer', auth, async (req, res) => {
  try {
    const { sessionId, answer } = req.body;
    if (!sessionId || answer === undefined || answer === null || answer === '') {
      return res.status(400).json({ error: 'Session ID and answer are required.' });
    }

    const result = await pool.query(
      `SELECT * FROM game_sessions
       WHERE id = $1 AND user_id = $2 AND status = 'pending'`,
      [sessionId, req.user.id]
    );
    const session = result.rows[0];
    if (!session) {
      return res.status(404).json({ error: 'Question not found or already answered.' });
    }

    const correct = Number(answer) === session.solution;
    await pool.query(
      `UPDATE game_sessions
       SET user_answer = $1, is_correct = $2, status = $3, answered_at = now()
       WHERE id = $4`,
      [Number(answer), correct, correct ? 'solved' : 'failed', sessionId]
    );

    res.json({
      correct,
      solution: session.solution,
      yourAnswer: Number(answer),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/game/mystats — this player's stats
router.get('/mystats', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE is_correct) AS correct
       FROM game_sessions WHERE user_id = $1`,
      [req.user.id]
    );
    const { total, correct } = result.rows[0];
    res.json({ total: Number(total), correct: Number(correct) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
