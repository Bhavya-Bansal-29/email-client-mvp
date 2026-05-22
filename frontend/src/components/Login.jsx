import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api';
import { showToast } from '../toast';

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${API_URL}/auth/login`);
      window.location.href = response.data.authUrl;
    } catch (error) {
      showToast.error('Failed to initiate login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-snow dark:bg-onyx p-4">
      <div className="bg-white dark:bg-graphite rounded-xl shadow-sm border border-graphite/10 dark:border-snow/10 p-10 sm:p-12 max-w-md w-full animate-slide-up">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-verdigris/10 text-verdigris mb-6">
            <span>📧</span>
          </div>
          <h1 className="text-3xl font-bold text-onyx dark:text-snow mb-2 tracking-tight">
            Email Client
          </h1>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-verdigris hover:bg-pearl text-snow dark:text-onyx font-semibold py-3.5 px-6 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:hover:bg-verdigris"
        >
          {loading ? (
            <>
              <span className="animate-spin">⚙️</span>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <span>🔐</span>
              <span>Sign in with Gmail</span>
            </>
          )}
        </button>

        <div className="mt-8 pt-6 border-t border-graphite/10 dark:border-snow/10 text-center animate-fade-in">
          <p className="text-xs text-graphite/70 dark:text-snow/50 max-w-[250px] mx-auto leading-relaxed">
            Your emails are secure and private.
          </p>
        </div>
      </div>
    </div>
  );
}
