import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { IoSettingsOutline, IoMailOutline, IoKeyOutline, IoShieldCheckmarkOutline, IoPersonOutline } from 'react-icons/io5';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'smtp' | 'keys' | 'permissions'>('profile');

  // SMTP form state
  const [smtpHost, setSmtpHost] = useState<string>('smtp.sendgrid.net');
  const [smtpPort, setSmtpPort] = useState<number>(587);
  const [smtpUser, setSmtpUser] = useState<string>('apikey');
  const [smtpStatus, setSmtpStatus] = useState<string>('');

  // Key generator state
  const [apiKey, setApiKey] = useState<string>('sp_live_9a4f21b8c0e7d6f5a3');
  const [keyCreated, setKeyCreated] = useState<string>('');

  // Profile Form state
  const [displayName, setDisplayName] = useState<string>(user?.name || 'Alexander Wright');
  const [displayEmail, setDisplayEmail] = useState<string>(user?.email || 'alex@stackpilot.ai');
  const [profileStatus, setProfileStatus] = useState<string>('');

  // Permission checklist state
  const [perms, setPerms] = useState<any>({
    'Super Admin': { CRM: true, PM: true, Finance: true, SEO: true },
    'Project Manager': { CRM: true, PM: true, Finance: false, SEO: false },
    'Developer': { CRM: false, PM: true, Finance: false, SEO: false },
    'Finance': { CRM: false, PM: false, Finance: true, SEO: false },
    'Client': { CRM: false, PM: true, Finance: true, SEO: false }
  });

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

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus('Profile updated successfully.');
    setTimeout(() => setProfileStatus(''), 4000);
  };

  const handlePermChange = (role: string, module: string) => {
    setPerms({
      ...perms,
      [role]: {
        ...perms[role],
        [module]: !perms[role][module]
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-black font-display text-white tracking-tight">Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your profile, email server settings, API keys, and team permissions.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/80 gap-6">
        {[
          { key: 'profile', label: 'Profile' },
          { key: 'smtp', label: 'Email Settings' },
          { key: 'keys', label: 'API Keys' },
          { key: 'permissions', label: 'Permissions' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
              activeTab === tab.key ? 'border-b-2 border-[#22C55E] text-[#111827]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'profile' && (
        <Card className="max-w-xl">
          <div className="border-b border-slate-800 pb-4 mb-4 flex items-center gap-2">
            <IoPersonOutline className="text-[#22C55E]" size={16} />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Profile Details</h3>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Email</label>
              <input
                type="email"
                required
                value={displayEmail}
                onChange={(e) => setDisplayEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-slate-500 font-semibold">Role: <span className="text-[#22C55E] font-bold uppercase tracking-wider">{user?.role}</span></span>
              <Button type="submit" className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">Save Profile</Button>
            </div>

            {profileStatus && (
              <p className="text-[10px] text-[#22C55E] font-bold bg-[#22C55E]/10 border border-[#22C55E]/20 p-2.5 rounded-xl">
                {profileStatus}
              </p>
            )}
          </form>
        </Card>
      )}

      {activeTab === 'smtp' && (
        <Card className="max-w-xl">
          <div className="border-b border-slate-800 pb-4 mb-4 flex items-center gap-2">
            <IoMailOutline className="text-[#22C55E]" size={16} />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Email Server (SMTP)</h3>
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
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Port</label>
                <input
                  type="number"
                  required
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
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
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Password</label>
              <input
                type="password"
                defaultValue="••••••••••••••••••••••••••"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>

            <Button type="submit" className="w-full text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">Save Settings</Button>

            {smtpStatus && (
              <p className="text-[10px] text-[#22C55E] font-bold bg-[#22C55E]/10 border border-[#22C55E]/20 p-2.5 rounded-xl">
                {smtpStatus}
              </p>
            )}
          </form>
        </Card>
      )}

      {activeTab === 'keys' && (
        <Card className="max-w-xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center gap-2">
            <IoKeyOutline className="text-[#22C55E]" size={16} />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">API Keys</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Active API Key</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-[#22C55E] outline-none font-mono"
                />
                <Button onClick={handleGenerateKey} variant="secondary" className="text-xs shrink-0 bg-white text-[#111827] border border-[#22C55E]">
                  Regenerate Key
                </Button>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed">
              Use this API key to integrate StackPilot with external web forms or services.
            </p>

            {keyCreated && (
              <p className="text-[10px] text-[#22C55E] font-bold bg-[#22C55E]/10 border border-[#22C55E]/20 p-2.5 rounded-xl">
                {keyCreated}
              </p>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'permissions' && (
        <Card>
          <div className="border-b border-slate-800 pb-4 mb-4 flex items-center gap-2">
            <IoShieldCheckmarkOutline className="text-[#22C55E]" size={16} />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Permissions Matrix</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2 text-center">Clients</th>
                  <th className="py-3 px-2 text-center">Projects</th>
                  <th className="py-3 px-2 text-center">Billing</th>
                  <th className="py-3 px-2 text-center">Reports</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(perms).map((role) => (
                  <tr key={role} className="border-b border-slate-800/40 hover:bg-slate-900/10 text-slate-300">
                    <td className="py-3.5 px-2 font-bold text-slate-200">{role}</td>
                    <td className="py-3.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={perms[role].CRM}
                        onChange={() => handlePermChange(role, 'CRM')}
                        className="w-4 h-4 rounded border-slate-800 text-[#22C55E] focus:ring-0 cursor-pointer mx-auto"
                      />
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={perms[role].PM}
                        onChange={() => handlePermChange(role, 'PM')}
                        className="w-4 h-4 rounded border-slate-800 text-[#22C55E] focus:ring-0 cursor-pointer mx-auto"
                      />
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={perms[role].Finance}
                        onChange={() => handlePermChange(role, 'Finance')}
                        className="w-4 h-4 rounded border-slate-800 text-[#22C55E] focus:ring-0 cursor-pointer mx-auto"
                      />
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={perms[role].SEO}
                        onChange={() => handlePermChange(role, 'SEO')}
                        className="w-4 h-4 rounded border-slate-800 text-[#22C55E] focus:ring-0 cursor-pointer mx-auto"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
export default Settings;
