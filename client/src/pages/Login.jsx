import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api('/auth/login', { method: 'POST', body: { username, password } });
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
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
        <button type="submit">Login</button>
      </form>
      <p className="hint">
        No account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
