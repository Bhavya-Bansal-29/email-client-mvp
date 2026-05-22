import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api';
import { Send, Loader2, CheckCircle2, AlertCircle, PenLine } from 'lucide-react';

export default function Compose({ userId, onComposeDone }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!to.trim() || !subject.trim() || !body.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await axios.post(`${API_URL}/api/send`, {
        userId,
        to: to.trim(),
        subject: subject.trim(),
        body: body.trim(),
      });

      setSuccess(true);
      setTo('');
      setSubject('');
      setBody('');

      setTimeout(() => {
        setSuccess(false);
        onComposeDone();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to send email. Please try again.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col py-6">
      <div className="bg-white dark:bg-graphite rounded-xl shadow-sm p-8 animate-slide-up border border-graphite/10 dark:border-snow/10">
        
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-graphite/10 dark:border-snow/10">
          <div className="w-12 h-12 rounded-lg bg-verdigris/10 text-verdigris flex items-center justify-center">
            <PenLine size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-onyx dark:text-snow tracking-tight">
              Compose Email
            </h2>
            <p className="text-graphite/70 dark:text-snow/70 text-sm mt-0.5">
              Draft a new message.
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-6 bg-verdigris/10 border border-verdigris/20 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="text-verdigris shrink-0" size={20} />
            <div>
              <p className="text-onyx dark:text-snow font-medium text-sm">Sent Successfully!</p>
              <p className="text-graphite dark:text-snow/80 text-xs mt-0.5">Your message is on its way.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={20} />
            <p className="text-red-800 dark:text-red-200 font-medium text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-5">
          <div className="group">
            <label className="block text-xs font-semibold text-graphite dark:text-snow/80 uppercase tracking-wider mb-1.5 transition-colors group-focus-within:text-verdigris">
              To
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-4 py-2.5 bg-snow/50 dark:bg-onyx/50 border border-graphite/20 dark:border-snow/20 rounded-lg text-onyx dark:text-snow placeholder-graphite/40 dark:placeholder-snow/40 focus:outline-none focus:border-verdigris focus:ring-1 focus:ring-verdigris transition-colors text-sm"
              required
            />
          </div>

          <div className="group">
            <label className="block text-xs font-semibold text-graphite dark:text-snow/80 uppercase tracking-wider mb-1.5 transition-colors group-focus-within:text-verdigris">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              className="w-full px-4 py-2.5 bg-snow/50 dark:bg-onyx/50 border border-graphite/20 dark:border-snow/20 rounded-lg text-onyx dark:text-snow placeholder-graphite/40 dark:placeholder-snow/40 focus:outline-none focus:border-verdigris focus:ring-1 focus:ring-verdigris transition-colors text-sm"
              required
            />
          </div>

          <div className="group">
            <label className="block text-xs font-semibold text-graphite dark:text-snow/80 uppercase tracking-wider mb-1.5 transition-colors group-focus-within:text-verdigris">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here..."
              rows="10"
              className="w-full px-4 py-3 bg-snow/50 dark:bg-onyx/50 border border-graphite/20 dark:border-snow/20 rounded-lg text-onyx dark:text-snow placeholder-graphite/40 dark:placeholder-snow/40 focus:outline-none focus:border-verdigris focus:ring-1 focus:ring-verdigris transition-colors text-sm resize-none custom-scrollbar"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-verdigris hover:bg-pearl disabled:bg-graphite/20 disabled:dark:bg-snow/10 text-snow dark:text-onyx disabled:text-graphite/50 font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Email
                </>
              )}
            </button>
            <button
              type="reset"
              onClick={() => {
                setTo('');
                setSubject('');
                setBody('');
                setError(null);
              }}
              className="bg-graphite/5 dark:bg-snow/5 hover:bg-graphite/10 dark:hover:bg-snow/10 border border-transparent text-graphite dark:text-snow font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
