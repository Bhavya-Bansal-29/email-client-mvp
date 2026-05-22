import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const email = params.get('email');
    const error = params.get('error');

    if (error) {
      alert('Authentication failed. Please try again.');
      setLoading(false);
      return;
    }

    if (userId && email) {
      setUser({ userId, email });
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-snow dark:bg-onyx"></div>;
  }

  return (
    <div className="min-h-screen bg-snow dark:bg-onyx font-sans text-onyx dark:text-snow transition-colors duration-200">
      {!user ? <Login /> : <Dashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
