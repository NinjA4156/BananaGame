import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Game from './pages/Game.jsx';
import Scoreboard from './pages/Scoreboard.jsx';

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="app">
      <nav className="topbar">
        <Link to="/" className="logo">🍌 Banana Game</Link>
        <div className="nav-links">
          {token ? (
            <>
              <span className="user">Hi, {username}</span>
              <Link to="/">Play</Link>
              <Link to="/scoreboard">Scoreboard</Link>
              <button onClick={logout} className="btn-link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
        </Routes>
      </main>
    </div>
  );
}
