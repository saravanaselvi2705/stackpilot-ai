import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCustomization } from '../context/CustomizationContext';
import { 
  IoSpeedometerOutline, 
  IoPeopleOutline, 
  IoFolderOpenOutline, 
  IoListOutline, 
  IoSparklesOutline, 
  IoGlobeOutline, 
  IoPeopleCircleOutline, 
  IoCashOutline, 
  IoCalendarOutline, 
  IoSettingsOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoLogOutOutline
} from 'react-icons/io5';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings, hasPermission } = useCustomization();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    'Dashboard': true,
    'Project Management': true,
    'AI Workspace': false,
    'Finance': false,
    'Reports': false,
    'Team': false,
    'Leave Management': false,
    'Productivity': true,
    'Administration': false
  });
  const location = useLocation();
  const currentPathWithSearch = location.pathname + location.search;

  const toggleCategory = (catTitle: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catTitle]: !prev[catTitle]
    }));
  };

  const navigationGroups = [
    {
      title: 'Dashboard',
      items: [
        ...(settings.sidebarMenu.dashboard ? [{ name: 'Overview', path: '/dashboard', icon: <IoSpeedometerOutline size={18} /> }] : []),
        ...(settings.sidebarMenu.crm && hasPermission('CRM', 'view') ? [{ name: 'Clients', path: '/crm', icon: <IoPeopleOutline size={18} /> }] : [])
      ]
    },
    {
      title: 'Project Management',
      items: [
        ...(settings.sidebarMenu.projects && hasPermission('PM', 'view') ? [{ name: 'Projects', path: '/projects', icon: <IoFolderOpenOutline size={18} /> }] : []),
        ...(settings.sidebarMenu.tasks && hasPermission('PM', 'view') ? [{ name: 'Tasks', path: '/tasks', icon: <IoListOutline size={18} /> }] : [])
      ]
    },
    {
      title: 'AI Workspace',
      items: [
        ...(settings.sidebarMenu.documentation ? [{ name: 'AI Tools', path: '/ai-studio', icon: <IoSparklesOutline size={18} /> }] : [])
      ]
    },
    {
      title: 'Finance',
      items: [
        ...(settings.sidebarMenu.finance && hasPermission('Finance', 'view') ? [{ name: 'Invoice & Billing', path: '/finance', icon: <IoCashOutline size={18} /> }] : [])
      ]
    },
    {
      title: 'Reports',
      items: [
        ...(settings.sidebarMenu.reports && hasPermission('SEO', 'view') ? [
          { name: 'SEO Reports', path: '/seo?tab=seo', icon: <IoGlobeOutline size={18} /> },
          { name: 'Project Reports', path: '/seo?tab=projects', icon: <IoGlobeOutline size={18} /> },
          { name: 'Project Test Reports', path: '/seo?tab=tests', icon: <IoGlobeOutline size={18} /> },
          { name: 'Revenue Reports', path: '/seo?tab=revenue', icon: <IoGlobeOutline size={18} /> },
          { name: 'Employee Performance Reports', path: '/seo?tab=employee', icon: <IoGlobeOutline size={18} /> },
          { name: 'Team Performance Reports', path: '/seo?tab=team', icon: <IoGlobeOutline size={18} /> },
          { name: 'Task Reports', path: '/seo?tab=tasks', icon: <IoGlobeOutline size={18} /> }
        ] : [])
      ]
    },
    {
      title: 'Team',
      items: [
        ...(settings.sidebarMenu.team ? [
          { name: 'Team Members', path: '/team', icon: <IoPeopleCircleOutline size={18} /> }
        ] : [])
      ]
    },
    {
      title: 'Leave Management',
      items: [
        ...(settings.sidebarMenu.team ? [
          { name: 'Leave Requests', path: '/leave-requests', icon: <IoCalendarOutline size={18} /> }
        ] : [])
      ]
    },
    {
      title: 'Productivity',
      items: [
        ...(settings.sidebarMenu.calendar ? [{ name: 'Calendar', path: '/calendar', icon: <IoCalendarOutline size={18} /> }] : [])
      ]
    },
    {
      title: 'Administration',
      items: [
        { name: 'Administration', path: '/settings', icon: <IoSettingsOutline size={18} /> }
      ]
    }
  ];

  const isActive = (itemPath: string) => {
    if (currentPathWithSearch === itemPath) return true;
    if (itemPath === '/crm' && location.pathname === '/crm' && !location.search) return true;
    if (itemPath === '/finance' && location.pathname === '/finance' && !location.search) return true;
    if (itemPath === '/team' && location.pathname === '/team' && !location.search) return true;
    if (itemPath === '/dashboard' && location.pathname === '/dashboard' && !location.search) return true;
    if (itemPath === '/settings' && location.pathname === '/settings' && !location.search) return true;
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
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain shrink-0" />
            ) : (
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-white shadow-md shrink-0 text-xs"
                style={{ backgroundColor: settings.brandColor }}
              >
                {settings.logoText}
              </div>
            )}
            {!collapsed && (
              <span className="font-display font-black text-sm tracking-wider text-slate-200 select-none truncate">
                {settings.companyName}
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
        <nav className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navigationGroups.map((group) => {
            const isExpanded = expandedCategories[group.title];
            
            // Skip displaying empty groups (e.g. if Admin-only items are filtered out)
            if (group.items.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                {/* Expandable Category Header */}
                {!collapsed ? (
                  <button
                    onClick={() => toggleCategory(group.title)}
                    className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-slate-500 hover:text-slate-350 uppercase tracking-widest cursor-pointer select-none"
                  >
                    <span>{group.title}</span>
                    <span className="text-slate-500">
                      {isExpanded ? <IoChevronUpOutline size={10} /> : <IoChevronDownOutline size={10} />}
                    </span>
                  </button>
                ) : (
                  <div className="border-b border-slate-800/40 my-1" />
                )}

                {/* Category Items */}
                {(isExpanded || collapsed) && (
                  <div className="space-y-0.5 transition-all duration-300">
                    {group.items.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <NavLink
                          key={item.name}
                          to={item.path}
                          style={
                            active 
                              ? { 
                                  color: settings.brandColor, 
                                  backgroundColor: `${settings.brandColor}15`, 
                                  borderColor: `${settings.brandColor}30` 
                                } 
                              : {}
                          }
                          className={
                            `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/10`
                          }
                          title={collapsed ? item.name : undefined}
                        >
                          <div className="shrink-0">{item.icon}</div>
                          {!collapsed && <span className="truncate">{item.name}</span>}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
              <p className="text-[10px] font-semibold uppercase tracking-wider truncate" style={{ color: settings.brandColor }}>{user?.role}</p>
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
