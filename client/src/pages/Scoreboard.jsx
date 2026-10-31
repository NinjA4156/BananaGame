import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function Scoreboard() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/scoreboard')
      .then((d) => setRows(d.scoreboard))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="card">
      <h1>🏆 Scoreboard</h1>
      {error && <p className="error">{error}</p>}
      {rows.length === 0 && !error && <p>No games played yet. Be the first!</p>}
      {rows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Correct</th>
              <th>Played</th>
              <th>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id}>
                <td>{['🥇', '🥈', '🥉'][i] || i + 1}</td>
                <td>{row.username}</td>
                <td>{row.correct}</td>
                <td>{row.total_played}</td>
                <td>{row.accuracy == null ? '—' : `${row.accuracy}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
