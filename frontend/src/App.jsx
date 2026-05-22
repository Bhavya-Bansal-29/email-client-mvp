import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { showToast } from './toast';
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
      showToast.error('Authentication failed. Please try again.');
      setLoading(false);
      return;
    }

    if (userId && email) {
      setUser({ userId, email });
      showToast.success('Welcome back!');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
    showToast.info('Logged out successfully');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-snow dark:bg-onyx">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-snow dark:bg-onyx font-sans text-onyx dark:text-snow transition-colors duration-200">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {!user ? <Login /> : <Dashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
