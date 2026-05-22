import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { api, API_URL } from './api';
import { showToast } from './toast';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const SESSION_KEY = 'emailclient_session';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const email = params.get('email');
    const error = params.get('error');

    if (error) {
      showToast.error('Authentication failed. Please try again.');
      setLoading(false);
      return;
    }

    if (userId && email) {
      // Fresh login from OAuth callback — save to localStorage
      const session = { userId, email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      showToast.success('Welcome back!');
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoading(false);
      return;
    }

    // No URL params — try to restore session from localStorage
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const session = JSON.parse(stored);
        if (session.userId && session.email) {
          // Validate the session is still valid on the backend
          api.get(`${API_URL}/api/user?userId=${session.userId}`)
            .then(() => {
              setUser(session);
              setLoading(false);
            })
            .catch(() => {
              // Session invalid — clear and show login
              localStorage.removeItem(SESSION_KEY);
              showToast.info('Session expired. Please sign in again.');
              setLoading(false);
            });
          return;
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    showToast.info('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-snow dark:bg-onyx">
        <div className="w-8 h-8 border-2 border-verdigris/30 border-t-verdigris rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-snow dark:bg-onyx font-sans text-onyx dark:text-snow transition-colors duration-200">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#2b2c28',
            color: '#fffafb',
            border: '1px solid rgba(255,250,251,0.08)',
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: "'Raleway', system-ui, sans-serif",
            padding: '10px 16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          },
        }}
        gap={8}
        visibleToasts={3}
      />
      {!user ? <Login /> : <Dashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
