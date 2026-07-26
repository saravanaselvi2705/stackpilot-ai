import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCustomization } from '../context/CustomizationContext';
import { Badge } from './UI';
import { 
  IoSearchOutline, 
  IoNotificationsOutline, 
  IoTerminalOutline, 
  IoHomeOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoFlashOutline,
  IoChevronDownOutline,
  IoPeopleOutline,
  IoListOutline,
  IoCashOutline
} from 'react-icons/io5';
import type { UserRole } from '../../../../packages/shared/types';
import API from '../services/api';

interface NavbarProps {
  onSearchOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchOpen }) => {
  const { user, switchRole, isMock } = useAuth();
  const { settings, updateSettings, roles: customRoles } = useCustomization();
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
          <div className="w-1.5 h-1.5 rounded-full animate-pulse animate-duration-1000" style={{ backgroundColor: settings.brandColor }} />
          <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
            {isMock ? 'Demo Mode' : 'Connected'}
          </span>
        </div>
      </div>

      {/* Right Side Options */}
      <div className="flex items-center gap-3">
        {/* Quick Actions Dropdown */}
        <div className="relative" ref={quickRef}>
          <button
            onClick={() => setQuickActionsOpen(!quickActionsOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 text-slate-405 hover:text-white transition-all text-xs font-semibold cursor-pointer"
            title="Quick Actions"
          >
            <IoFlashOutline size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Actions</span>
            <IoChevronDownOutline size={10} className="text-slate-500" />
          </button>
          
          {quickActionsOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-950 border border-slate-850 p-2.5 shadow-2xl z-50 space-y-1">
              <span className="block px-2 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider">Quick Actions</span>
              <button
                onClick={() => { setQuickActionsOpen(false); navigate('/crm?action=add'); }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-350 hover:text-white hover:bg-slate-900 rounded-lg text-left"
              >
                <IoPeopleOutline size={13} style={{ color: settings.brandColor }} /> Add Client
              </button>
              <button
                onClick={() => { setQuickActionsOpen(false); navigate('/tasks?action=add'); }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-350 hover:text-white hover:bg-slate-900 rounded-lg text-left"
              >
                <IoListOutline size={13} style={{ color: settings.brandColor }} /> New Project Task
              </button>
              <button
                onClick={() => { setQuickActionsOpen(false); navigate('/finance?action=add'); }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-350 hover:text-white hover:bg-slate-900 rounded-lg text-left"
              >
                <IoCashOutline size={13} style={{ color: settings.brandColor }} /> Create Invoice
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-slate-450 hover:text-white p-2 rounded-xl bg-slate-900/20 border border-slate-800/80 hover:bg-slate-800/50 cursor-pointer transition-colors"
          title="Toggle Theme Mode"
        >
          {settings.theme === 'dark' ? <IoSunnyOutline size={15} /> : <IoMoonOutline size={15} />}
        </button>

        {/* Home Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 text-slate-455 hover:text-white transition-all text-xs font-semibold cursor-pointer"
          title="Return to Dashboard"
        >
          <IoHomeOutline size={14} style={{ color: settings.brandColor }} />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Notifications Dropdown Container */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative text-slate-405 hover:text-white p-2 rounded-xl bg-slate-900/20 border border-slate-800/80 hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <IoNotificationsOutline size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-slate-950 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-950 border border-slate-850 p-4 shadow-2xl z-50 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-850 pb-2">
                <span className="font-bold">Alert Notifications</span>
                <span className="text-[10px] bg-slate-905 border border-slate-800 px-1.5 py-0.5 rounded text-slate-350">{unreadCount} Unread</span>
              </div>
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No notifications found.</p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div 
                      key={n._id} 
                      className={`p-2.5 rounded-xl border transition-all duration-200 text-left ${
                        n.read 
                          ? 'bg-slate-900/10 border-slate-800/30 opacity-60' 
                          : 'bg-slate-900/40 border-slate-850 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-200 truncate">{n.title}</span>
                        <Badge variant={n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'primary'}>
                          {n.type}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed mb-2">{n.message}</p>
                      
                      <div className="flex items-center justify-between text-[8px] text-slate-500">
                        <span>{new Date(n.createdAt).toLocaleTimeString()}</span>
                        {!n.read && (
                          <button 
                            onClick={() => handleRead(n._id)}
                            className="hover:underline font-bold cursor-pointer"
                            style={{ color: settings.brandColor }}
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

        {/* User profile Badge in header */}
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 pl-2 border-l border-slate-800 cursor-pointer hover:opacity-80 transition-opacity"
          title="View Profile Settings"
        >
          <img 
            src={user?.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin'} 
            alt="Profile Avatar"
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 shrink-0"
          />
          <div className="hidden xl:block text-left">
            <h4 className="text-xs font-bold text-slate-200 truncate max-w-[100px]">{user?.name}</h4>
            <span className="text-[9px] text-slate-500 font-semibold truncate block">{user?.role}</span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
