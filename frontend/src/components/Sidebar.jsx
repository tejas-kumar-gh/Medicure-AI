import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserSquare2, Bot, Sparkles, X } from 'lucide-react';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Health Profile', path: '/profile', icon: UserSquare2 },
    { name: 'AI Chatbot', path: '/chat', icon: Bot },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile background overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/80 bg-white/95 px-4 py-6 transition-transform duration-300 ease-in-out dark:border-slate-800/80 dark:bg-[#0b0f19]/95 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">
              MediCure
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 lg:hidden focus:outline-none"
          >
            <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
