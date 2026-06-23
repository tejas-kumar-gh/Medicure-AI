import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    // Default to dark mode if no user preference is set
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 dark:bg-[#0b0f19] dark:text-slate-100">
      
      {/* Decorative Blur Glows (Behind UI components) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-brand-500/5 dark:bg-brand-500/10 rounded-full glow-bg-primary pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full glow-bg-secondary pointer-events-none" />

      {/* Navigation sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content body */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
