import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge, Drawer } from './UI';
import { 
  IoSearchOutline, 
  IoNotificationsOutline, 
  IoSparklesSharp, 
  IoTerminalOutline, 
  IoFolderOpenOutline, 
  IoListOutline, 
  IoCashOutline, 
  IoPeopleOutline, 
  IoDocumentTextOutline,
  IoHomeOutline
} from 'react-icons/io5';
import type { UserRole } from '../../../../packages/shared/types';
import API from '../services/api';

interface NavbarProps {
  onSearchOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchOpen }) => {
  const { user, switchRole, isMock } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const navigate = useNavigate();


  const roles: UserRole[] = [
    'Super Admin',
    'Admin',
    'Project Manager',
    'Business Analyst',
    'Developer',
    'Tester',
    'SEO Executive',
    'Finance',
    'Client'
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const list = await API.notifications.list();
        setNotifications(list);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRead = async (id: string) => {
    try {
      await API.notifications.markAsRead(id);
      const list = await API.notifications.list();
      setNotifications(list);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="glass-dark border-b border-slate-800/80 px-6 py-4 flex items-center justify-between h-[73px] sticky top-0 z-20">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 text-slate-400 hover:text-white transition-all text-xs font-semibold select-none cursor-pointer w-48 md:w-64"
        >
          <IoSearchOutline size={14} className="text-slate-400 shrink-0" />
          <span>Search...</span>
          <span className="ml-auto bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-slate-500 font-mono shrink-0">⌘K</span>
        </button>

        {/* Server Status Indicators */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/30 border border-slate-800/50 rounded-lg px-2 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
            {isMock ? 'Demo Mode' : 'Connected'}
          </span>
        </div>
      </div>

      {/* Right Side Options */}
      <div className="flex items-center gap-4">
        {/* Home Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 text-slate-400 hover:text-white transition-all text-xs font-semibold cursor-pointer"
          title="Return to Dashboard"
        >
          <IoHomeOutline size={14} className="text-[#22C55E]" />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Role Simulator Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/30 border border-slate-800/50 rounded-xl px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-[#22C55E] animate-pulse">
            <IoTerminalOutline size={14} />
            <span className="text-[10px] font-bold tracking-widest uppercase hidden md:inline">Select Role:</span>
          </div>
          <select
            value={user?.role || 'Developer'}
            onChange={(e) => switchRole(e.target.value as UserRole)}
            className="bg-transparent text-xs font-bold text-slate-100 outline-none cursor-pointer pr-2 border-none"
          >
            {roles.map((r) => (
              <option key={r} value={r} className="bg-slate-950 text-slate-100 font-semibold">
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Icon */}
        <button 
          onClick={() => setNotifOpen(true)}
          className="relative text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900/20 border border-slate-800/80 hover:bg-slate-800/50 cursor-pointer transition-colors"
        >
          <IoNotificationsOutline size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-slate-950 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications Drawer */}
      <Drawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} title="Alerts">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span>Alerts</span>
            <span>{unreadCount} Unread Alerts</span>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No notifications found.</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div 
                  key={n._id} 
                  className={`p-3.5 rounded-xl border transition-all duration-200 ${
                    n.read 
                      ? 'bg-slate-900/10 border-slate-800/30 opacity-60' 
                      : 'bg-slate-900/50 border-slate-800/80 shadow-md shadow-[#22C55E]/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-200 truncate">{n.title}</span>
                    <Badge variant={n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'primary'}>
                      {n.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2.5">{n.message}</p>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{new Date(n.createdAt).toLocaleTimeString()}</span>
                    {!n.read && (
                      <button 
                        onClick={() => handleRead(n._id)}
                        className="text-[#22C55E] hover:text-[#1db053] font-semibold cursor-pointer underline decoration-[#22C55E]/20 hover:decoration-[#22C55E]"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Drawer>
    </header>
  );
};
export default Navbar;
