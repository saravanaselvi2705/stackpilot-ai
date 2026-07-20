import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { useCustomization } from '../../context/CustomizationContext';
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoKeyOutline, 
  IoShieldCheckmarkOutline, 
  IoColorPaletteOutline, 
  IoPeopleOutline, 
  IoDocumentTextOutline,
  IoCopyOutline,
  IoTrashOutline,
  IoAddOutline,
  IoGlobeOutline
} from 'react-icons/io5';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { 
    settings, 
    updateSettings, 
    resetBranding, 
    roles, 
    addRole, 
    updateRole, 
    deleteRole, 
    usersList, 
    updateUserRole,
    demoMode,
    setDemoMode
  } = useCustomization();

  const getInitialTab = () => {
    const query = new URLSearchParams(window.location.search);
    const tab = query.get('tab');
    if (tab) return tab;
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());

  useEffect(() => {
    const tab = getInitialTab();
    setActiveTab(tab);
  }, [window.location.search]);

  // Profile Form state
  const [displayName, setDisplayName] = useState<string>(user?.name || '');
  const [displayEmail, setDisplayEmail] = useState<string>(user?.email || '');
  const [profileStatus, setProfileStatus] = useState<string>('');

  // SMTP Settings State
  const [smtpHost, setSmtpHost] = useState<string>('smtp.sendgrid.net');
  const [smtpPort, setSmtpPort] = useState<number>(587);
  const [smtpUser, setSmtpUser] = useState<string>('apikey');
  const [smtpStatus, setSmtpStatus] = useState<string>('');

  // API Key State
  const [apiKey, setApiKey] = useState<string>('sp_live_9a4f21b8c0e7d6f5a3');
  const [keyCreated, setKeyCreated] = useState<string>('');

  // Roles Customizer Local State
  const [selectedRole, setSelectedRole] = useState<string>('Project Manager');
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [newRoleDesc, setNewRoleDesc] = useState<string>('');
  const [roleMessage, setRoleMessage] = useState<string>('');

  // Sitemap generator state
  const [sitemapCode, setSitemapCode] = useState<string>('');
  const [sitemapMsg, setSitemapMsg] = useState<string>('');

  const currentRoleConfig = roles.find(r => r.name === selectedRole) || roles[1];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus('Profile updated successfully.');
    setTimeout(() => setProfileStatus(''), 4000);
  };

  const handleSMTPUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSmtpStatus('Email server settings updated successfully.');
    setTimeout(() => setSmtpStatus(''), 4000);
  };

  const handleGenerateKey = () => {
    const randomHex = Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const newKey = `sp_live_${randomHex}`;
    setApiKey(newKey);
    setKeyCreated('API key regenerated successfully.');
    setTimeout(() => setKeyCreated(''), 4000);
  };

  // Roles CRUD matrix checkboxes handlers
  const handlePermissionToggle = (module: 'CRM' | 'PM' | 'Finance' | 'SEO', action: 'view' | 'create' | 'edit' | 'delete') => {
    const currentPerms = { ...currentRoleConfig.permissions };
    currentPerms[module] = {
      ...currentPerms[module],
      [action]: !currentPerms[module][action]
    };
    updateRole(selectedRole, {
      ...currentRoleConfig,
      permissions: currentPerms
    });
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    
    const newConfig = {
      name: newRoleName.trim(),
      description: newRoleDesc,
      permissions: {
        CRM: { view: false, create: false, edit: false, delete: false },
        PM: { view: true, create: false, edit: false, delete: false },
        Finance: { view: false, create: false, edit: false, delete: false },
        SEO: { view: false, create: false, edit: false, delete: false }
      }
    };
    addRole(newConfig);
    setSelectedRole(newConfig.name);
    setNewRoleName('');
    setNewRoleDesc('');
    setRoleMessage(`Custom role "${newConfig.name}" added successfully.`);
    setTimeout(() => setRoleMessage(''), 4000);
  };

  const handleCloneRole = () => {
    const cloneName = `${currentRoleConfig.name} (Copy)`;
    const newConfig = {
      name: cloneName,
      description: `Copy of ${currentRoleConfig.description}`,
      permissions: JSON.parse(JSON.stringify(currentRoleConfig.permissions))
    };
    addRole(newConfig);
    setSelectedRole(cloneName);
    setRoleMessage(`Role cloned as "${cloneName}".`);
    setTimeout(() => setRoleMessage(''), 4000);
  };

  const handleDeleteRole = () => {
    if (['super admin', 'admin', 'developer'].includes(selectedRole.toLowerCase())) {
      setRoleMessage('Default administrative roles cannot be deleted.');
      setTimeout(() => setRoleMessage(''), 4000);
      return;
    }
    deleteRole(selectedRole);
    setSelectedRole('Project Manager');
    setRoleMessage(`Role "${selectedRole}" deleted successfully.`);
    setTimeout(() => setRoleMessage(''), 4000);
  };

  const handleGenerateSitemap = () => {
    const code = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${window.location.origin}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${window.location.origin}/login</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${window.location.origin}/dashboard</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    setSitemapCode(code);
    setSitemapMsg('Sitemap.xml generated successfully in client sitemap manager.');
    setTimeout(() => setSitemapMsg(''), 4000);
  };

  // Check super admin permission
  const isAdmin = user?.role === 'Super Admin' || user?.role === 'Admin';

  return (
    <div className="space-y-8 pb-12">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-black font-display text-white tracking-tight">Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure profile parameters, enterprise branding, dynamic roles, email servers, and integrations.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/80 gap-6 overflow-x-auto scrollbar-none pb-0.5">
        {[
          { key: 'profile', label: 'Profile' },
          ...(isAdmin ? [{ key: 'users', label: 'User Management' }] : []),
          ...(isAdmin ? [{ key: 'roles', label: 'Roles & Permissions' }] : []),
          ...(isAdmin ? [{ key: 'branding', label: 'Enterprise Branding' }] : []),
          { key: 'smtp', label: 'Email Server' },
          { key: 'keys', label: 'API Keys' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-xs font-bold tracking-wider uppercase transition-all shrink-0 cursor-pointer ${
              activeTab === tab.key 
                ? 'border-b-2 text-slate-200' 
                : 'text-slate-500 hover:text-slate-350'
            }`}
            style={activeTab === tab.key ? { borderBottomColor: settings.brandColor } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile details */}
      {activeTab === 'profile' && (
        <Card className="max-w-xl">
          <div className="border-b border-slate-850 pb-4 mb-4 flex items-center gap-2">
            <IoPersonOutline style={{ color: settings.brandColor }} size={16} />
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Profile Details</h3>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-opacity-50"
                style={{ '--tw-ring-color': settings.brandColor } as any}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Email Address</label>
              <input
                type="email"
                required
                value={displayEmail}
                onChange={(e) => setDisplayEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-slate-500 font-semibold">
                Current Role:{' '}
                <span className="font-bold uppercase tracking-wider" style={{ color: settings.brandColor }}>
                  {user?.role}
                </span>
              </span>
              <Button type="submit" style={{ backgroundColor: settings.brandColor }} className="text-xs text-white">
                Save Profile
              </Button>
            </div>

            {profileStatus && (
              <p className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-400">
                {profileStatus}
              </p>
            )}
          </form>
        </Card>
      )}

      {/* User Management tab */}
      {activeTab === 'users' && isAdmin && (
        <Card className="w-full">
          <div className="border-b border-slate-850 pb-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IoPeopleOutline style={{ color: settings.brandColor }} size={16} />
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">User Directory</h3>
            </div>
            <Badge variant="primary">{usersList.length} Active Accounts</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                  <th className="py-3 px-2">Member</th>
                  <th className="py-3 px-2">Department</th>
                  <th className="py-3 px-2">Active Role</th>
                  <th className="py-3 px-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((usr) => (
                  <tr key={usr._id} className="border-b border-slate-800/40 hover:bg-slate-900/10 text-slate-350">
                    <td className="py-3 px-2 flex items-center gap-3">
                      <img src={usr.avatarUrl} alt="Avatar" className="w-7 h-7 rounded bg-slate-900 border border-slate-800" />
                      <div>
                        <div className="font-bold text-slate-200">{usr.name}</div>
                        <div className="text-[10px] text-slate-500">{usr.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-semibold">{usr.department || 'Engineering'}</td>
                    <td className="py-3 px-2">
                      <select
                        value={usr.role}
                        onChange={(e) => updateUserRole(usr._id, e.target.value)}
                        className="bg-slate-950 border border-slate-850 text-[10px] font-bold text-slate-300 rounded px-2 py-1 outline-none cursor-pointer"
                      >
                        {roles.map((r) => (
                          <option key={r.name} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button 
                        onClick={() => updateUserRole(usr._id, 'Client')}
                        className="text-slate-500 hover:text-slate-300 mr-2 text-[10px] underline"
                      >
                        Reset Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Role Management Tab */}
      {activeTab === 'roles' && isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="border-b border-slate-850 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IoShieldCheckmarkOutline style={{ color: settings.brandColor }} size={16} />
                <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Role Permissions Matrix</h3>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-slate-950 border border-slate-850 text-xs font-bold text-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={handleCloneRole} 
                  title="Clone Role" 
                  className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <IoCopyOutline size={14} />
                </button>
                <button 
                  onClick={handleDeleteRole} 
                  title="Delete Role" 
                  className="p-1.5 bg-slate-900 border border-slate-800 text-red-500 hover:text-red-400 rounded-lg cursor-pointer"
                >
                  <IoTrashOutline size={14} />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic mb-4">
              Configuring permissions for: <span className="font-bold text-slate-200">{selectedRole}</span> — {currentRoleConfig.description}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                    <th className="py-2 px-2">Module Access</th>
                    <th className="py-2 px-2 text-center">View (Read)</th>
                    <th className="py-2 px-2 text-center">Create</th>
                    <th className="py-2 px-2 text-center">Edit</th>
                    <th className="py-2 px-2 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {(['CRM', 'PM', 'Finance', 'SEO'] as const).map((module) => (
                    <tr key={module} className="border-b border-slate-800/40 hover:bg-slate-900/10 text-slate-350">
                      <td className="py-3 px-2 font-bold text-slate-200">{module === 'PM' ? 'Project Management' : module}</td>
                      {(['view', 'create', 'edit', 'delete'] as const).map((action) => (
                        <td key={action} className="py-3 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={!!currentRoleConfig.permissions[module]?.[action]}
                            onChange={() => handlePermissionToggle(module, action)}
                            disabled={selectedRole === 'Super Admin'} // Super Admin permissions are permanent
                            className="w-4 h-4 rounded border-slate-850 text-emerald-500 focus:ring-0 cursor-pointer disabled:opacity-40"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {roleMessage && (
              <p className="mt-4 text-[10px] font-bold bg-[#22C55E]/10 border border-[#22C55E]/20 p-2.5 rounded-xl text-[#22C55E]">
                {roleMessage}
              </p>
            )}
          </Card>

          {/* Add custom role card */}
          <Card>
            <div className="border-b border-slate-850 pb-4 mb-4 flex items-center gap-2">
              <IoAddOutline style={{ color: settings.brandColor }} size={16} />
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Create Custom Role</h3>
            </div>

            <form onSubmit={handleAddRole} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead QA Analyst"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Description</label>
                <textarea
                  placeholder="Define role scope..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none h-20 resize-none"
                />
              </div>

              <Button type="submit" style={{ backgroundColor: settings.brandColor }} className="w-full text-xs text-white">
                Add Custom Role
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Enterprise Customization & Branding */}
      {activeTab === 'branding' && isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main settings options */}
          <Card className="space-y-6">
            <div className="border-b border-slate-850 pb-4 flex items-center gap-2">
              <IoColorPaletteOutline style={{ color: settings.brandColor }} size={16} />
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Enterprise Branding</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Company Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => updateSettings({ companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Logo Monogram</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={settings.logoText}
                    onChange={(e) => updateSettings({ logoText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Logo URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://company.com/logo.png"
                  value={settings.logoUrl}
                  onChange={(e) => updateSettings({ logoUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Theme Palette</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => updateSettings({ theme: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-850 text-xs font-bold text-slate-200 rounded-xl px-4 py-2.5 outline-none"
                  >
                    <option value="dark">Enterprise Dark Mode</option>
                    <option value="light">Classic Light Theme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Brand Accent Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.brandColor}
                      onChange={(e) => updateSettings({ brandColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-850 cursor-pointer overflow-hidden bg-transparent"
                    />
                    <input
                      type="text"
                      maxLength={7}
                      value={settings.brandColor}
                      onChange={(e) => updateSettings({ brandColor: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">System Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => updateSettings({ currency: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-850 text-xs font-bold text-slate-200 rounded-xl px-4 py-2.5 outline-none"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Sitemap & Domain Config</label>
                  <button
                    onClick={handleGenerateSitemap}
                    className="w-full text-xs font-bold py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl cursor-pointer flex items-center justify-center gap-2"
                  >
                    <IoGlobeOutline size={14} style={{ color: settings.brandColor }} /> Generate Sitemap
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-850 pt-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Reset System Branding</div>
                  <div className="text-[10px] text-slate-500">Restore factory styling parameters.</div>
                </div>
                <button
                  type="button"
                  onClick={resetBranding}
                  className="px-4 py-2 border border-slate-850 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white bg-slate-900/40 cursor-pointer"
                >
                  Reset Theme
                </button>
              </div>
            </div>
          </Card>

          {/* Database Profile controls & Sidebar Modules Config */}
          <div className="space-y-6">
            <Card className="space-y-4">
              <div className="border-b border-slate-850 pb-4 flex items-center gap-2">
                <IoShieldCheckmarkOutline style={{ color: settings.brandColor }} size={16} />
                <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Modules & Widgets Config</h3>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">Enabled Sidebar Modules</label>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  {Object.keys(settings.sidebarMenu).map((key) => (
                    <label key={key} className="flex items-center gap-2.5 p-2 bg-slate-950 border border-slate-850 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!(settings.sidebarMenu as any)[key]}
                        onChange={(e) => {
                          const menuCopy = { ...settings.sidebarMenu };
                          (menuCopy as any)[key] = e.target.checked;
                          updateSettings({ sidebarMenu: menuCopy });
                        }}
                        className="w-4 h-4 rounded text-emerald-500 border-slate-850 focus:ring-0"
                      />
                      <span className="capitalize">{key}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">Active Dashboard Widgets</label>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  {Object.keys(settings.dashboardWidgets).map((key) => (
                    <label key={key} className="flex items-center gap-2.5 p-2 bg-slate-950 border border-slate-850 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!(settings.dashboardWidgets as any)[key]}
                        onChange={(e) => {
                          const widgetCopy = { ...settings.dashboardWidgets };
                          (widgetCopy as any)[key] = e.target.checked;
                          updateSettings({ dashboardWidgets: widgetCopy });
                        }}
                        className="w-4 h-4 rounded text-emerald-500 border-slate-850 focus:ring-0"
                      />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            {/* Sitemap Preview Box */}
            {sitemapCode && (
              <Card className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sitemap.xml Preview</span>
                  <Badge variant="success">Active SEO URL</Badge>
                </div>
                <pre className="text-[9px] bg-slate-950 p-3 rounded-xl border border-slate-850 overflow-x-auto text-[#22C55E] max-h-40 font-mono scrollbar-none">
                  {sitemapCode}
                </pre>
                {sitemapMsg && <div className="text-[9px] text-[#22C55E] font-bold">{sitemapMsg}</div>}
              </Card>
            )}

            {/* Seeding & Profile Mode */}
            <Card className="space-y-4">
              <div className="border-b border-slate-850 pb-4 flex items-center gap-2">
                <IoGlobeOutline style={{ color: settings.brandColor }} size={16} />
                <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Git Data Seeding Profile</h3>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    Database Seeding Mode:
                    <Badge variant={demoMode ? 'success' : 'primary'}>
                      {demoMode ? 'Demo Seeding Active' : 'Clean Production'}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Active git profile controls whether local storage initializes with rich test data or remains fully blank.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDemoMode(!demoMode)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shrink-0 cursor-pointer"
                  style={{ backgroundColor: settings.brandColor }}
                >
                  {demoMode ? 'Switch to Production' : 'Enable Demo Seeding'}
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* SMTP Email Settings */}
      {activeTab === 'smtp' && (
        <Card className="max-w-xl">
          <div className="border-b border-slate-850 pb-4 mb-4 flex items-center gap-2">
            <IoMailOutline style={{ color: settings.brandColor }} size={16} />
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Email Server (SMTP)</h3>
          </div>

          <form onSubmit={handleSMTPUpdate} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Host</label>
                <input
                  type="text"
                  required
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Port</label>
                <input
                  type="number"
                  required
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Username</label>
              <input
                type="text"
                required
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Password</label>
              <input
                type="password"
                defaultValue="••••••••••••••••••••••••••"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <Button type="submit" style={{ backgroundColor: settings.brandColor }} className="w-full text-xs text-white">
              Save Settings
            </Button>

            {smtpStatus && (
              <p className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-400">
                {smtpStatus}
              </p>
            )}
          </form>
        </Card>
      )}

      {/* API Key management */}
      {activeTab === 'keys' && (
        <Card className="max-w-xl space-y-6">
          <div className="border-b border-slate-850 pb-4 flex items-center gap-2">
            <IoKeyOutline style={{ color: settings.brandColor }} size={16} />
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">API Keys</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Active API Key</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs outline-none font-mono"
                  style={{ color: settings.brandColor }}
                />
                <Button onClick={handleGenerateKey} variant="secondary" className="text-xs shrink-0 bg-white text-[#111827] border" style={{ borderColor: settings.brandColor }}>
                  Regenerate Key
                </Button>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed">
              Use this API key to integrate StackPilot with external web forms or telemetry services.
            </p>

            {keyCreated && (
              <p className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-400">
                {keyCreated}
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Settings;
