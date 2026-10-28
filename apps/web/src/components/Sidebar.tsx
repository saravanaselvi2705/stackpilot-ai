import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCustomization } from '../context/CustomizationContext';
import { 
  IoSpeedometerOutline, 
  IoPersonOutline,
  IoNotificationsOutline,
  IoPeopleOutline, 
  IoFolderOpenOutline, 
  IoListOutline, 
  IoFlashOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoCashOutline, 
  IoBarChartOutline,
  IoBusinessOutline,
  IoBriefcaseOutline,
  IoPeopleCircleOutline,
  IoAirplaneOutline,
  IoRibbonOutline,
  IoShieldCheckmarkOutline,
  IoHardwareChipOutline,
  IoSettingsOutline,
  IoSparklesOutline,
  IoChatbubblesOutline,
  IoStatsChartOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoLogOutOutline,
  IoSearchOutline
} from 'react-icons/io5';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings, hasPermission } = useCustomization();
  const [menuSearch, setMenuSearch] = useState<string>('');
  
  const [collapsed, setCollapsedState] = useState<boolean>(() => {
    const stored = localStorage.getItem('sp_sidebar_collapsed');
    return stored ? stored === 'true' : false;
  });

  const setCollapsed = (val: boolean) => {
    setCollapsedState(val);
    localStorage.setItem('sp_sidebar_collapsed', String(val));
  };

  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    'Workspace': true,
    'Operations': true,
    'Business': true,
    'People': false,
    'Administration': false,
    'AI OS': true
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
      title: 'Workspace',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <IoSpeedometerOutline size={18} /> },
        { name: 'My Work', path: '/my-work', icon: <IoPersonOutline size={18} /> },
        { name: 'Notifications', path: '/notifications', icon: <IoNotificationsOutline size={18} /> }
      ]
    },
    {
      title: 'Operations',
      items: [
        ...(hasPermission('CRM', 'view') ? [{ name: 'CRM Pipeline', path: '/crm', icon: <IoPeopleOutline size={18} /> }] : []),
        ...(hasPermission('PM', 'view') ? [{ name: 'Projects', path: '/projects', icon: <IoFolderOpenOutline size={18} /> }] : []),
        ...(hasPermission('PM', 'view') ? [
          { name: 'Sprint Planning', path: '/tasks?tab=sprints', icon: <IoFlashOutline size={18} /> },
          { name: 'Task Board', path: '/tasks?tab=board', icon: <IoListOutline size={18} /> }
        ] : []),
        { name: 'Calendar', path: '/calendar', icon: <IoCalendarOutline size={18} /> },
        { name: 'Documents', path: '/documents', icon: <IoDocumentTextOutline size={18} /> }
      ]
    },
    {
      title: 'Business',
      items: [
        ...(hasPermission('Finance', 'view') ? [{ name: 'Finance & Invoices', path: '/finance', icon: <IoCashOutline size={18} /> }] : []),
        { name: 'Reports Hub', path: '/reports', icon: <IoBarChartOutline size={18} /> },
        { name: 'Contracts', path: '/contracts', icon: <IoBriefcaseOutline size={18} /> },
        { name: 'Approvals Engine', path: '/approvals', icon: <IoShieldCheckmarkOutline size={18} /> }
      ]
    },
    {
      title: 'People',
      items: [
        { name: 'Team Members', path: '/team', icon: <IoPeopleCircleOutline size={18} /> },
        { name: 'Leave Requests', path: '/leave-requests', icon: <IoAirplaneOutline size={18} /> },
        { name: 'Timesheets', path: '/timesheets', icon: <IoRibbonOutline size={18} /> }
      ]
    },
    {
      title: 'Administration',
      items: [
        ...(user?.role === 'Super Admin' || user?.role === 'Admin' ? [
          { name: 'Organization', path: '/organization', icon: <IoBusinessOutline size={18} /> },
          { name: 'Audit Logs', path: '/audit-logs', icon: <IoShieldCheckmarkOutline size={18} /> },
          { name: 'Workflows', path: '/workflows', icon: <IoHardwareChipOutline size={18} /> },
          { name: 'System Health', path: '/system-health', icon: <IoHardwareChipOutline size={18} /> }
        ] : []),
        { name: 'Settings & Roles', path: '/settings', icon: <IoSettingsOutline size={18} /> }
      ]
    },
    {
      title: 'AI OS',
      items: [
        { name: 'AI Workspace', path: '/ai-studio', icon: <IoSparklesOutline size={18} /> },
        { name: 'AI Assistant', path: '/ai-assistant', icon: <IoChatbubblesOutline size={18} /> },
        { name: 'AI Business Reports', path: '/ai-reports', icon: <IoStatsChartOutline size={18} /> }
      ]
    }
  ];

  const isActive = (itemPath: string) => {
    if (currentPathWithSearch === itemPath) return true;
    if (itemPath === '/dashboard' && location.pathname === '/dashboard' && !location.search) return true;
    if (itemPath === '/my-work' && location.pathname === '/my-work') return true;
    if (itemPath === '/crm' && location.pathname === '/crm' && !location.search) return true;
    if (itemPath === '/finance' && location.pathname === '/finance' && !location.search) return true;
    if (itemPath === '/team' && location.pathname === '/team' && !location.search) return true;
    if (itemPath === '/settings' && location.pathname === '/settings' && !location.search) return true;
    return location.pathname === itemPath.split('?')[0] && itemPath.indexOf('?') === -1;
  };

  return (
    <aside 
      className={`bg-[#0B0F17] h-screen flex flex-col justify-between transition-all duration-300 border-r border-slate-800 relative z-30 ${
        collapsed ? 'w-[78px]' : 'w-[260px]'
      }`}
    >
      {/* Top Brand Logo */}
      <div>
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800 h-[73px]">
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
              <div className="flex flex-col min-w-0">
                <span className="font-display font-black text-sm tracking-wider text-white select-none truncate">
                  {settings.companyName}
                </span>
                <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest">Business OS v1.1</span>
              </div>
            )}
          </div>
          
          {/* Collapse Toggle */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 cursor-pointer hidden md:block shrink-0 transition-colors"
          >
            {collapsed ? <IoChevronForwardOutline size={16} /> : <IoChevronBackOutline size={16} />}
          </button>
        </div>

        {/* Sidebar Search Filter */}
        {!collapsed && (
          <div className="px-3 pt-3">
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-2.5 text-slate-500" size={14} />
              <input
                type="text"
                placeholder="Filter menu..."
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
        )}
 
        {/* Navigation list */}
        <nav className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-190px)] scrollbar-none">
          {navigationGroups.map((group) => {
            const filteredItems = group.items.filter(item => 
              item.name.toLowerCase().includes(menuSearch.toLowerCase())
            );

            if (filteredItems.length === 0) return null;
            const isExpanded = expandedCategories[group.title] || menuSearch.length > 0;

            return (
              <div key={group.title} className="space-y-1">
                {/* Category Header */}
                {!collapsed ? (
                  <button
                    onClick={() => toggleCategory(group.title)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-extrabold text-slate-400 hover:text-slate-200 uppercase tracking-widest cursor-pointer select-none"
                  >
                    <span>{group.title}</span>
                    <span className="text-slate-400">
                      {isExpanded ? <IoChevronUpOutline size={10} /> : <IoChevronDownOutline size={10} />}
                    </span>
                  </button>
                ) : (
                  <div className="border-b border-slate-800/60 my-1" />
                )}

                {/* Category Items */}
                {(isExpanded || collapsed) && (
                  <div className="space-y-1 transition-all duration-300">
                    {filteredItems.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <NavLink
                          key={item.name}
                          to={item.path}
                          style={
                            active 
                              ? { 
                                  color: settings.brandColor, 
                                  backgroundColor: `${settings.brandColor}18`, 
                                  borderColor: `${settings.brandColor}40` 
                                } 
                              : {}
                          }
                          className={
                            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border border-transparent ${
                              active ? '' : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                            }`
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
      <div className="p-3 border-t border-slate-800 bg-slate-950/80">
        <div className={`flex items-center gap-3 rounded-xl p-2 bg-slate-900/80 border border-slate-800 overflow-hidden ${
          collapsed ? 'justify-center' : ''
        }`}>
          <img 
            src={user?.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin'} 
            alt="User Avatar" 
            className="w-9 h-9 rounded-lg border border-slate-800 shrink-0 bg-slate-950"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
              <p className="text-[10px] font-semibold uppercase tracking-wider truncate" style={{ color: settings.brandColor }}>{user?.role}</p>
            </div>
          )}
          {!collapsed && (
            <button 
              onClick={() => logout()}
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer shrink-0 transition-colors"
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
