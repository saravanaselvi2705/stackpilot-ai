import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCustomization } from '../context/CustomizationContext';
import { Badge } from './UI';
import {
  IoSearchOutline,
  IoNotificationsOutline,
  IoHomeOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoFlashOutline,
  IoChevronDownOutline,
  IoPeopleOutline,
  IoListOutline,
  IoCashOutline
} from 'react-icons/io5';
import API from '../services/api';

interface NavbarProps {
  onSearchOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchOpen }) => {
  const { user, isMock } = useAuth();
  const { settings, updateSettings } = useCustomization();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState<boolean>(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const notifRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) {
        setQuickActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
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

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white dark:bg-[#0B0F17] border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between h-[73px] sticky top-0 z-20 transition-colors">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-semibold select-none cursor-pointer w-48 md:w-64"
        >
          <IoSearchOutline size={15} className="text-slate-400 shrink-0" />
          <span>Search platform...</span>
          <span className="ml-auto bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-400 font-mono shrink-0">⌘K</span>
        </button>

        {/* Server Status Indicators */}
        <div className="hidden lg:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#22C55E]" />
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wide uppercase">
            {isMock ? 'Demo Mode' : 'Connected'}
          </span>
        </div>
      </div>      {/* Right Side Options */}
      <div className="flex items-center gap-3">
        {/* Quick Actions Dropdown */}
        {/*<div className="relative" ref={quickRef}>
          <button
            onClick={() => setQuickActionsOpen(!quickActionsOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-all text-xs font-bold cursor-pointer"
            title="Quick Actions"
          >
            <IoFlashOutline size={15} className="text-amber-500" />
            <span className="hidden sm:inline">Actions</span>
            <IoChevronDownOutline size={12} className="text-slate-500" />
          </button>

          {quickActionsOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl z-50 space-y-1">
              <span className="block px-2.5 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Quick Actions</span>
              <button
                onClick={() => { setQuickActionsOpen(false); navigate('/crm?action=add'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
              >
                <IoPeopleOutline size={14} className="text-[#22C55E]" /> Add Client
              </button>
              <button
                onClick={() => { setQuickActionsOpen(false); navigate('/tasks?action=add'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
              >
                <IoListOutline size={14} className="text-[#22C55E]" /> New Project Task
              </button>
              <button
                onClick={() => { setQuickActionsOpen(false); navigate('/finance?action=add'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
              >
                <IoCashOutline size={14} className="text-[#22C55E]" /> Create Invoice
              </button>
            </div>
          )}
        </div>*/}

        {/* Theme Toggle */}
        {/* <button
          onClick={toggleTheme}
          className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer transition-all"
          title="Toggle Light/Dark Theme"
        >
          {settings.theme === 'dark' ? <IoSunnyOutline size={16} className="text-amber-400" /> : <IoMoonOutline size={16} className="text-slate-700" />}
        </button>*/}

        {/* Dashboard Home Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-all text-xs font-bold cursor-pointer"
          title="Return to Dashboard"
        >
          <IoHomeOutline size={15} className="text-[#22C55E]" />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Notifications Dropdown Container */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <IoNotificationsOutline size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-2xl z-50 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="font-bold">Notifications</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-bold">{unreadCount} Unread</span>
              </div>
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No notifications found.</p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-3 rounded-xl border transition-all duration-200 text-left ${n.read
                        ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/50 opacity-70'
                        : 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{n.title}</span>
                        <Badge variant={n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'primary'}>
                          {n.type}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{n.message}</p>

                      <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400">
                        <span>{new Date(n.createdAt).toLocaleTimeString()}</span>
                        {!n.read && (
                          <button
                            onClick={() => handleRead(n._id)}
                            className="hover:underline font-bold cursor-pointer text-[#22C55E]"
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
          )}
        </div>

        {/* User Profile Link */}
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 cursor-pointer hover:opacity-80 transition-opacity"
          title="View Profile Settings"
        >
          <img
            src={user?.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin'}
            alt="Profile Avatar"
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0"
          />
          <div className="hidden xl:block text-left">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">{user?.name}</h4>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold truncate block">{user?.role}</span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
