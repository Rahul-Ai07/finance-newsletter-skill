import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import NewsletterPage from './pages/NewsletterPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (stored in localStorage)
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUser({ id: storedUserId });
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">📧 Newsletter SaaS</h1>
            {user && (
              <div className="nav-links">
                <a href="/dashboard">Dashboard</a>
                <a href="/editor">Create Newsletter</a>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            {!user ? (
              <>
                <Route path="/" element={<SignupPage setUser={setUser} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/dashboard" element={<DashboardPage user={user} />} />
                <Route path="/editor" element={<EditorPage user={user} />} />
                <Route path="/newsletter/:id" element={<NewsletterPage user={user} />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
