import { useState } from 'react';
import Inbox from './Inbox';
import Sent from './Sent';
import Compose from './Compose';
import { Mail, Inbox as InboxIcon, Send, PenLine, LogOut } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('inbox');

  const tabs = [
    { id: 'inbox', label: 'Inbox', icon: <InboxIcon size={18} /> },
    { id: 'sent', label: 'Sent', icon: <Send size={18} /> },
    { id: 'compose', label: 'Compose', icon: <PenLine size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-snow dark:bg-onyx transition-colors duration-200 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-graphite border-b border-graphite/10 dark:border-snow/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-verdigris/10 text-verdigris flex items-center justify-center">
                <Mail size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-onyx dark:text-snow tracking-tight">
                  Email Client
                </h1>
                <p className="text-xs font-medium text-graphite/70 dark:text-snow/70 truncate max-w-[200px] sm:max-w-xs">
                  {user.email}
                </p>
              </div>
            </div>
            {/* Mobile Logout */}
            <button
              onClick={onLogout}
              className="md:hidden p-2 rounded-lg text-graphite dark:text-snow/70 hover:bg-graphite/5 dark:hover:bg-snow/5 hover:text-onyx dark:hover:text-snow transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <nav className="flex w-full sm:w-auto bg-graphite/5 dark:bg-snow/5 p-1 rounded-lg overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-graphite text-verdigris shadow-sm'
                      : 'text-graphite dark:text-snow/70 hover:text-onyx dark:hover:text-snow hover:bg-graphite/10 dark:hover:bg-snow/10'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>

            <button
              onClick={onLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 text-graphite dark:text-snow/70 hover:bg-graphite/5 dark:hover:bg-snow/5 hover:text-onyx dark:hover:text-snow border border-transparent hover:border-graphite/20 dark:hover:border-snow/20"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
        {activeTab === 'inbox' && <Inbox userId={user.userId} />}
        {activeTab === 'sent' && <Sent userId={user.userId} />}
        {activeTab === 'compose' && <Compose userId={user.userId} onComposeDone={() => setActiveTab('sent')} />}
      </main>
    </div>
  );
}
