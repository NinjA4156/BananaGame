import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api('/auth/register', { method: 'POST', body: { username, password } });
      setDone(true);
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}
      {done && <p className="success">Account created! Redirecting to login…</p>}
      <form onSubmit={submit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Create Account</button>
      </form>
      <p className="hint">
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
