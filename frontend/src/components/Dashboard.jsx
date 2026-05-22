import { useState } from 'react';
import Inbox from './Inbox';
import Sent from './Sent';
import Compose from './Compose';
import { Mail, Inbox as InboxIcon, Send, PenLine, LogOut, Menu, X } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('inbox');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'inbox', label: 'Inbox', icon: InboxIcon },
    { id: 'sent', label: 'Sent', icon: Send },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-snow dark:bg-onyx transition-colors duration-200 flex overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-onyx/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-graphite border-r border-graphite/10 dark:border-snow/10
        flex flex-col transition-transform duration-200 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-5 pb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-verdigris/10 text-verdigris flex items-center justify-center flex-shrink-0">
            <Mail size={20} />
          </div>
          <h1 className="text-lg font-bold text-onyx dark:text-snow tracking-tight">Iris</h1>
        </div>

        {/* Compose button */}
        <div className="px-3 mb-2">
          <button
            onClick={() => handleNavClick('compose')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === 'compose'
                ? 'bg-verdigris text-snow shadow-md shadow-verdigris/20'
                : 'bg-verdigris/10 text-verdigris hover:bg-verdigris/20'
            }`}
          >
            <PenLine size={18} />
            <span>Compose</span>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-verdigris/8 dark:bg-verdigris/12 text-verdigris font-semibold'
                    : 'text-graphite dark:text-snow/70 hover:bg-graphite/5 dark:hover:bg-snow/5 hover:text-onyx dark:hover:text-snow'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-verdigris' : ''} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-graphite/10 dark:border-snow/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-verdigris/10 text-verdigris flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <p className="text-xs font-medium text-graphite/70 dark:text-snow/70 truncate flex-1">
              {user.email}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-sm text-graphite dark:text-snow/70 hover:bg-graphite/5 dark:hover:bg-snow/5 hover:text-onyx dark:hover:text-snow transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden bg-white dark:bg-graphite border-b border-graphite/10 dark:border-snow/10 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-graphite dark:text-snow/70 hover:bg-graphite/5 dark:hover:bg-snow/5 transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-verdigris/10 text-verdigris flex items-center justify-center">
              <Mail size={16} />
            </div>
            <h1 className="text-base font-bold text-onyx dark:text-snow tracking-tight">Iris</h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto animate-fade-in" style={{ animationDelay: '0.05s', opacity: 0 }}>
          {activeTab === 'inbox' && <Inbox userId={user.userId} />}
          {activeTab === 'sent' && <Sent userId={user.userId} />}
          {activeTab === 'compose' && <Compose userId={user.userId} onComposeDone={() => setActiveTab('sent')} />}
        </main>
      </div>
    </div>
  );
}
