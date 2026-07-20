import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  IoSpeedometerOutline, 
  IoPeopleOutline, 
  IoFolderOpenOutline, 
  IoListOutline, 
  IoDocumentTextOutline, 
  IoSparklesOutline, 
  IoBookOutline, 
  IoGlobeOutline, 
  IoPeopleCircleOutline, 
  IoCashOutline, 
  IoCalendarOutline, 
  IoSettingsOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoLogOutOutline,
  IoNotificationsOutline
} from 'react-icons/io5';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();
  const currentPathWithSearch = location.pathname + location.search;

  const navigationGroups = [
    {
      title: 'Dashboard',
      items: [
        { name: 'Overview', path: '/dashboard', icon: <IoSpeedometerOutline size={18} /> }
      ]
    },
    {
      title: 'CRM',
      items: [
        { name: 'Clients', path: '/crm', icon: <IoPeopleOutline size={18} /> },
        { name: 'Leads', path: '/crm?tab=leads', icon: <IoPeopleOutline size={18} /> },
        { name: 'Contacts', path: '/crm?tab=contacts', icon: <IoPeopleOutline size={18} /> }
      ]
    },
    {
      title: 'Project Management',
      items: [
        { name: 'Projects', path: '/projects', icon: <IoFolderOpenOutline size={18} /> },
        { name: 'Tasks', path: '/tasks', icon: <IoListOutline size={18} /> },
        { name: 'Requirements', path: '/documentation?tab=requirements', icon: <IoDocumentTextOutline size={18} /> },
        { name: 'Documents', path: '/documentation', icon: <IoBookOutline size={18} /> }
      ]
    },
    {
      title: 'AI Workspace',
      items: [
        { name: 'AI Tools', path: '/ai-studio', icon: <IoSparklesOutline size={18} /> }
      ]
    },
    {
      title: 'Finance',
      items: [
        { name: 'Billing', path: '/finance?tab=billing', icon: <IoCashOutline size={18} /> },
        { name: 'Invoices', path: '/finance?tab=invoices', icon: <IoCashOutline size={18} /> },
        { name: 'Reports', path: '/finance?tab=reports', icon: <IoCashOutline size={18} /> }
      ]
    },
    {
      title: 'Reports',
      items: [
        { name: 'Reports', path: '/seo', icon: <IoGlobeOutline size={18} /> }
      ]
    },
    {
      title: 'Team',
      items: [
        { name: 'Team Members', path: '/team', icon: <IoPeopleCircleOutline size={18} /> },
        { name: 'Leave Requests', path: '/team?tab=leaves', icon: <IoCalendarOutline size={18} /> }
      ]
    },
    {
      title: 'Productivity',
      items: [
        { name: 'Calendar', path: '/calendar', icon: <IoCalendarOutline size={18} /> },
        { name: 'Notifications', path: '/dashboard?tab=notifications', icon: <IoNotificationsOutline size={18} /> }
      ]
    },
    {
      title: 'Administration',
      items: [
        { name: 'Settings', path: '/settings', icon: <IoSettingsOutline size={18} /> }
      ]
    }
  ];

  const isActive = (itemPath: string) => {
    if (currentPathWithSearch === itemPath) return true;
    if (itemPath === '/crm' && location.pathname === '/crm' && !location.search) return true;
    if (itemPath === '/documentation' && location.pathname === '/documentation' && !location.search) return true;
    if (itemPath === '/finance?tab=billing' && location.pathname === '/finance' && (!location.search || location.search === '?tab=billing')) return true;
    if (itemPath === '/team' && location.pathname === '/team' && !location.search) return true;
    if (itemPath === '/dashboard' && location.pathname === '/dashboard' && !location.search) return true;
    return location.pathname === itemPath.split('?')[0] && itemPath.indexOf('?') === -1;
  };

  return (
    <aside 
      className={`glass h-screen flex flex-col justify-between transition-all duration-300 border-r border-slate-800/80 relative z-30 ${
        collapsed ? 'w-[78px]' : 'w-[260px]'
      }`}
    >
      {/* Top Brand Logo */}
      <div>
        <div className="flex items-center justify-between px-5 py-6 border-b border-slate-800/60 h-[73px]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#22C55E] to-emerald-600 flex items-center justify-center font-display font-black text-slate-950 shadow-md shadow-[#22C55E]/10 shrink-0">
              S
            </div>
            {!collapsed && (
              <span className="font-display font-black text-lg tracking-wider text-white select-none">
                StackPilot<span className="text-xs font-bold text-[#22C55E] align-super ml-0.5">AI</span>
              </span>
            )}
          </div>
          
          {/* Collapse Toggle */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900/30 border border-slate-800/50 hover:bg-slate-800/60 cursor-pointer hidden md:block shrink-0"
          >
            {collapsed ? <IoChevronForwardOutline size={16} /> : <IoChevronBackOutline size={16} />}
          </button>
        </div>
 
         {/* Navigation list */}
         <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-180px)]">
           {navigationGroups.map((group) => (
             <div key={group.title} className="space-y-0.5">
               {!collapsed && (
                 <h5 className="px-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 mt-2">
                   {group.title}
                 </h5>
               )}
               {group.items.map((item) => {
                 const active = isActive(item.path);
                 return (
                   <NavLink
                     key={item.name}
                     to={item.path}
                     className={
                       `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                         active 
                           ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 shadow-inner' 
                           : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-transparent'
                       }`
                     }
                   >
                     <div className="shrink-0">{item.icon}</div>
                     {!collapsed && <span className="truncate">{item.name}</span>}
                   </NavLink>
                 );
               })}
             </div>
           ))}
         </nav>
       </div>
 
       {/* User Footer Panel */}
       <div className="p-3 border-t border-slate-800/60 bg-slate-900/10">
         <div className={`flex items-center gap-3 rounded-xl p-2 bg-slate-900/30 border border-slate-800/30 overflow-hidden ${
           collapsed ? 'justify-center' : ''
         }`}>
           <img 
             src={user?.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin'} 
             alt="User Avatar" 
             className="w-9 h-9 rounded-lg border border-slate-800 shrink-0 bg-slate-900"
           />
           {!collapsed && (
             <div className="flex-1 min-w-0">
               <h4 className="text-xs font-bold text-slate-200 truncate">{user?.name}</h4>
               <p className="text-[10px] text-[#22C55E] font-semibold uppercase tracking-wider truncate">{user?.role}</p>
             </div>
           )}
          {!collapsed && (
            <button 
              onClick={logout}
              className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800/50 cursor-pointer shrink-0"
              title="Logout"
            >
              <IoLogOutOutline size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
