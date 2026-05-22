import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { api, API_URL } from '../api';
import { showToast } from '../toast';
import { Loader2, AlertTriangle, RefreshCw, MailOpen, Send } from 'lucide-react';

const POLL_INTERVAL = 30000; // 30 seconds

const getAvatarStyle = (name) => {
  const cleanName = name ? name.split('<')[0].replace(/"/g, '').trim() : 'Unknown';
  const initials = cleanName.substring(0, 2).toUpperCase() || '??';
  return { initials, colorClass: 'bg-pearl/20 text-verdigris' };
};

export default function Sent({ userId }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const pollTimerRef = useRef(null);

  const fetchSent = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);
    try {
      const response = await api.get(
        `${API_URL}/api/sent?userId=${userId}`
      );
      const newEmails = response.data.emails;
      
      if (silent && newEmails.length > emails.length) {
        const diff = newEmails.length - emails.length;
        showToast.info(`${diff} new sent email${diff > 1 ? 's' : ''} detected`);
      }

      setEmails(newEmails);
      if (!silent) {
        showToast.success('Sent emails loaded');
      }
    } catch (err) {
      if (!silent) {
        const errorMsg = 'Failed to load sent emails. Please try again.';
        setError(errorMsg);
        showToast.error(errorMsg);
      }
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId, emails.length]);

  // Initial fetch
  useEffect(() => {
    fetchSent();
  }, [userId]);

  // Auto-poll for new sent emails
  useEffect(() => {
    pollTimerRef.current = setInterval(() => {
      fetchSent({ silent: true });
    }, POLL_INTERVAL);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [fetchSent]);

  const handleManualRefresh = () => {
    fetchSent({ silent: false });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="text-center animate-fade-in text-graphite/70 dark:text-snow/70">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <p className="font-medium">Fetching sent emails...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-graphite border border-graphite/10 dark:border-snow/10 rounded-xl p-8 text-center animate-slide-up">
        <AlertTriangle className="mx-auto mb-4 text-verdigris" size={32} />
        <p className="text-onyx dark:text-snow font-medium text-lg mb-6">{error}</p>
        <button
          onClick={handleManualRefresh}
          className="bg-verdigris hover:bg-pearl text-snow dark:text-onyx font-semibold py-2 px-6 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      {/* Email List Sidebar */}
      <div className="lg:col-span-4 flex flex-col bg-white dark:bg-graphite rounded-xl overflow-hidden shadow-sm border border-graphite/10 dark:border-snow/10">
        <div className="p-4 border-b border-graphite/10 dark:border-snow/10 flex justify-between items-center bg-snow/50 dark:bg-onyx/50">
          <h2 className="font-semibold text-lg text-onyx dark:text-snow flex items-center gap-2">
            Sent <span className="px-2 py-0.5 rounded-md bg-graphite/5 dark:bg-snow/10 text-graphite dark:text-snow text-xs">{emails.length}</span>
          </h2>
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="p-1.5 rounded-md text-graphite/70 hover:text-verdigris hover:bg-graphite/5 dark:hover:bg-snow/5 transition-colors disabled:opacity-50"
            title="Refresh Sent"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-graphite/60 dark:text-snow/60 p-8 text-center">
              <Send size={48} className="mb-4 opacity-50" strokeWidth={1.5} />
              <p className="font-medium text-lg text-onyx dark:text-snow">No Sent Emails</p>
              <p className="text-sm mt-1">Emails you send will appear here.</p>
            </div>
          ) : (
            emails.map((email) => {
              const toName = email.to.split(',')[0].trim().split('<')[0].replace(/"/g, '').trim() || email.to;
              const { initials, colorClass } = getAvatarStyle(toName);
              const isSelected = selectedEmail?.id === email.id;
              
              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-verdigris/5 dark:bg-verdigris/10 border-l-2 border-verdigris'
                      : 'hover:bg-graphite/5 dark:hover:bg-snow/5 border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colorClass} flex items-center justify-center font-bold text-xs`}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <p className={`font-semibold text-sm truncate pr-2 ${isSelected ? 'text-verdigris' : 'text-onyx dark:text-snow'}`}>
                          To: {toName}
                        </p>
                        <p className={`text-[11px] whitespace-nowrap ${isSelected ? 'text-verdigris/80' : 'text-graphite/70 dark:text-snow/70'}`}>
                          {new Date(email.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <p className={`text-xs truncate font-medium mb-0.5 ${isSelected ? 'text-onyx dark:text-snow' : 'text-graphite dark:text-snow/90'}`}>
                        {email.subject || '(No Subject)'}
                      </p>
                      <p className="text-[11px] truncate text-graphite/70 dark:text-snow/50">
                        {email.snippet}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Email Detail Pane */}
      <div className="lg:col-span-8 flex flex-col bg-white dark:bg-graphite rounded-xl overflow-hidden shadow-sm border border-graphite/10 dark:border-snow/10">
        {selectedEmail ? (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-6 border-b border-graphite/10 dark:border-snow/10 bg-snow/30 dark:bg-onyx/30">
              <h3 className="text-xl font-bold text-onyx dark:text-snow mb-4 leading-tight">
                {selectedEmail.subject || '(No Subject)'}
              </h3>
              
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getAvatarStyle(selectedEmail.to.split(',')[0].trim()).colorClass} flex items-center justify-center font-bold text-xs`}>
                  {getAvatarStyle(selectedEmail.to.split(',')[0].trim()).initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                    <p className="font-semibold text-onyx dark:text-snow text-sm truncate">
                      To: {selectedEmail.to.split('<')[0].replace(/"/g, '').trim() || selectedEmail.to}
                    </p>
                    <p className="text-[11px] text-graphite/70 dark:text-snow/70 font-medium">
                      {new Date(selectedEmail.date).toLocaleString(undefined, { 
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <p className="text-[11px] text-graphite/70 dark:text-snow/70 mt-0.5">
                    <span className="opacity-75">to:</span> {selectedEmail.to}
                  </p>
                  <p className="text-[11px] text-graphite/70 dark:text-snow/70">
                    <span className="opacity-75">from:</span> {selectedEmail.from}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="prose dark:prose-invert max-w-none text-graphite dark:text-snow/90 text-[14px] leading-relaxed">
                {selectedEmail.snippet ? (
                   <p className="whitespace-pre-wrap">{selectedEmail.snippet}</p>
                ) : (
                  <p className="italic text-graphite/50 dark:text-snow/50">This message has no content.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-graphite/60 dark:text-snow/60">
            <MailOpen size={48} className="mb-4 opacity-40" strokeWidth={1.5} />
            <p className="text-lg font-medium text-onyx dark:text-snow mb-1">No message selected</p>
            <p className="text-sm">Choose an email from the list to read it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
