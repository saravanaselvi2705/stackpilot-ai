import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { UniversalSearch } from './UniversalSearch';

export const Layout: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // CMD+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex bg-slate-50 text-slate-900 min-h-screen relative overflow-hidden font-sans">
      {/* Decorative Glow Lights */}
      <div className="glow-orb bg-emerald-500/5 top-[-200px] left-[-200px] animate-glow" />
      <div className="glow-orb bg-indigo-500/5 bottom-[-100px] right-[-100px] animate-glow" style={{ animationDelay: '-6s' }} />

      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden z-10">
        <Navbar onSearchOpen={() => setSearchOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-slate-100/60 p-6 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Enterprise Universal Search Dialog Modal */}
      <UniversalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default Layout;
