import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/scoreboard — top players by correct answers
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.username,
              COUNT(g.id) AS total_played,
              COUNT(g.id) FILTER (WHERE g.is_correct) AS correct,
              ROUND(100.0 * COUNT(g.id) FILTER (WHERE g.is_correct) / NULLIF(COUNT(g.id), 0)) AS accuracy
       FROM users u
       LEFT JOIN game_sessions g ON g.user_id = u.id
       GROUP BY u.id, u.username
       HAVING COUNT(g.id) > 0
       ORDER BY correct DESC, accuracy DESC, total_played ASC
       LIMIT 20`
    );
    res.json({ scoreboard: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
