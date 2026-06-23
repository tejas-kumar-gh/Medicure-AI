import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, Menu } from 'lucide-react';

export const Navbar = ({ toggleSidebar, darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/85 px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0b0f19]/85">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 lg:hidden focus:outline-none"
        >
          <Menu className="h-6 w-6 text-slate-500 dark:text-slate-400" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">
            MediCure
          </span>
          <span className="hidden sm:inline-block rounded-full bg-brand-100/80 px-2.5 py-0.5 text-2xs font-semibold text-brand-600 dark:bg-brand-950/60 dark:text-brand-300">
            AI Assistant
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 focus:outline-none"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none mb-0.5">{user.name}</span>
              <span className="text-2xs text-slate-400 leading-none">{user.email}</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white font-bold text-sm shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/20 dark:hover:text-red-400 focus:outline-none"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
