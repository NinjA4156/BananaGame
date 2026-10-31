import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function Game() {
  const [puzzle, setPuzzle] = useState(null);   // { sessionId, questionUrl }
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);   // { correct, solution, yourAnswer }
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const loadStats = useCallback(() => {
    api('/game/mystats').then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const newQuestion = async () => {
    setError('');
    setResult(null);
    setAnswer('');
    setLoading(true);
    try {
      setPuzzle(await api('/game/question'));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api('/game/answer', {
        method: 'POST',
        body: { sessionId: puzzle.sessionId, answer },
      });
      setResult(res);
      loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <div className="card">
        <h1>🍌 Banana Worth Guessing Game</h1>
        <p>Each emoji has a value. Can you work out what the question mark is worth?</p>
        <p>You need an account to play.</p>
        <Link className="btn" to="/login">Login</Link>{' '}
        <Link className="btn outline" to="/register">Register</Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>🍌 Banana Worth Guessing Game</h1>
      {stats && (
        <p className="stats">
          Your record: {stats.correct} correct out of {stats.total} played
        </p>
      )}

      {!puzzle && (
        <>
          <p>Each emoji in the puzzle has a secret value. Guess what the <b>?</b> is worth!</p>
          <button className="btn big" onClick={newQuestion} disabled={loading}>
            {loading ? 'Loading…' : 'Start New Puzzle'}
          </button>
        </>
      )}

      {puzzle && (
        <>
          <img className="puzzle" src={puzzle.questionUrl} alt="Banana puzzle" />
          {result ? (
            <div className={`result ${result.correct ? 'good' : 'bad'}`}>
              <h2>{result.correct ? '✅ Correct!' : '❌ Wrong!'}</h2>
              <p>
                The banana is worth <b>{result.solution}</b>
                {!result.correct && <> — you guessed <b>{result.yourAnswer}</b>.</>}
              </p>
              <button className="btn big" onClick={newQuestion}>Next Puzzle</button>
            </div>
          ) : (
            <form onSubmit={submitAnswer} className="guess-form">
              <input
                type="number"
                placeholder="Your guess (a whole number)"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
              <button type="submit">Submit Guess</button>
              <button type="button" className="outline" onClick={newQuestion}>Skip</button>
            </form>
          )}
        </>
      )}

      {error && <p className="error">{error}</p>}
      <p className="hint"><Link to="/scoreboard">View the scoreboard →</Link></p>
    </div>
  );
}
