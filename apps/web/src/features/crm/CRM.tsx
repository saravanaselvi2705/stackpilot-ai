import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../components/UI';
import { useCustomization } from '../../context/CustomizationContext';
import { 
  IoAdd, 
  IoMailOutline, 
  IoCallOutline, 
  IoBusinessOutline, 
  IoArrowBackOutline,
  IoFolderOpenOutline,
  IoDocumentTextOutline,
  IoBookOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoSparklesOutline,
  IoTimeOutline,
  IoShieldCheckmarkOutline
} from 'react-icons/io5';
import API from '../../services/api';
import type { Client, Project } from '../../../../../packages/shared/types';

export const CRM: React.FC = () => {
  const { settings, formatCurrency, hasPermission } = useCustomization();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'info' | 'projects' | 'documents' | 'meetings' | 'billing' | 'timeline'>('info');
  
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // New Client Form State
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [value, setValue] = useState<number>(120000);
  const [status, setStatus] = useState<'Lead' | 'Active' | 'Inactive'>('Active');
  const [tags, setTags] = useState<string>('Enterprise, Key Client');
  const [notes, setNotes] = useState<string>('');
  const [address, setAddress] = useState<string>('100 Vercel Way, San Francisco, CA');

  const loadClientsAndProjects = async () => {
    try {
      const [clientData, projectData] = await Promise.all([
        API.crm.listLeads(),
        API.projects.list()
      ]);
      setClients(clientData);
      setProjects(projectData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadClientsAndProjects();
  }, []);

  // Listen to deep-links to auto-trigger the Add Client modal if permitted
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'add' && hasPermission('CRM', 'create')) {
      setModalOpen(true);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [hasPermission]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newClient = await API.crm.createLead({
        name,
        email,
        companyName,
        phone,
        value,
        status,
        tags: tags.split(',').map(t => t.trim()),
        notes,
      });

      // Reset
      setName('');
      setEmail('');
      setCompanyName('');
      setPhone('');
      setValue(120000);
      setStatus('Active');
      setTags('Enterprise, Key Client');
      setNotes('');
      setAddress('100 Vercel Way, San Francisco, CA');
      
      setModalOpen(false);
      loadClientsAndProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const advanceStatus = async (id: string, nextStatus: 'Lead' | 'Active' | 'Inactive') => {
    try {
      const updated = await API.crm.updateLead(id, { status: nextStatus });
      if (selectedClient && selectedClient._id === id) {
        setSelectedClient(updated);
      }
      loadClientsAndProjects();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter projects associated with the selected client
  const clientProjects = selectedClient 
    ? projects.filter(p => 
        p.client?.toLowerCase().includes(selectedClient.companyName?.toLowerCase() || '') ||
        selectedClient.companyName?.toLowerCase().includes(p.client?.toLowerCase() || '')
      )
    : [];

  return (
    <div className="space-y-8">
      {/* 1. Normal list view if no client selected */}
      {!selectedClient ? (
        <>
          {/* CRM Heading */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">Clients Directory</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Manage and track your active accounts, proposals, and partners.</p>
            </div>
            {hasPermission('CRM', 'create') && (
              <Button onClick={() => setModalOpen(true)} className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white">
                <IoAdd size={16} /> Add New Client
              </Button>
            )}
          </div>

          {/* Grid of Clients */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Active', 'Lead', 'Inactive'].map((stageKey) => {
              const stageClients = clients.filter(c => c.status === stageKey);
              const stageTotalValue = stageClients.reduce((acc, curr) => acc + (curr.value || 0), 0);
              
              return (
                <div key={stageKey} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 p-5 flex flex-col min-h-[350px]">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800/40">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 tracking-wider uppercase">
                        {stageKey === 'Active' ? 'Active Clients' : stageKey === 'Lead' ? 'Leads / Prospects' : 'Archived / Inactive'}
                      </h3>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{stageClients.length} accounts</span>
                    </div>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-350">{formatCurrency(stageTotalValue)}</span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
                    {stageClients.length === 0 ? (
                      <div className="text-center py-10 text-[10px] text-slate-500">No accounts in this phase</div>
                    ) : (
                      stageClients.map((c) => (
                        <div 
                          key={c._id} 
                          onClick={() => setSelectedClient(c)}
                          className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 hover:border-[#22C55E]/40 rounded-xl space-y-3 transition-all cursor-pointer hover:scale-[1.01]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-[#22C55E] transition-colors">{c.name}</h4>
                              <span className="text-[9px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                <IoBusinessOutline size={10} /> {c.companyName}
                              </span>
                            </div>
                            <span className="text-xs font-black text-[#22C55E]">{formatCurrency(c.value || 0)}</span>
                          </div>

                          {c.notes && <p className="text-[10px] text-slate-400 leading-relaxed truncate">{c.notes}</p>}

                          <div className="flex flex-wrap gap-1">
                            {c.tags?.map(t => (
                              <span key={t} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-[8px] text-slate-400 font-bold rounded">
                                {t}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-800/40 pt-2.5 mt-1">
                            <div className="flex items-center gap-2 text-slate-500">
                              <a href={`mailto:${c.email}`} onClick={e => e.stopPropagation()} className="hover:text-[#22C55E]">
                                <IoMailOutline size={13} />
                              </a>
                              {c.phone && (
                                <a href={`tel:${c.phone}`} onClick={e => e.stopPropagation()} className="hover:text-[#22C55E]">
                                  <IoCallOutline size={13} />
                                </a>
                              )}
                            </div>
                            <span className="text-[9px] font-bold text-[#22C55E] hover:underline">View Workspace →</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Directory list summary table */}
          <Card>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-200 font-display">Accounts Registry</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                    <th className="py-3 px-2">Client Name</th>
                    <th className="py-3 px-2">Company</th>
                    <th className="py-3 px-2">Email</th>
                    <th className="py-3 px-2">Phone</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr 
                      key={c._id} 
                      onClick={() => setSelectedClient(c)}
                      className="border-b border-slate-800/40 hover:bg-slate-900/10 text-slate-300 cursor-pointer"
                    >
                      <td className="py-3.5 px-2 font-bold text-white">{c.name}</td>
                      <td className="py-3.5 px-2 font-semibold">{c.companyName || 'Internal'}</td>
                      <td className="py-3.5 px-2 font-mono text-[10px]">{c.email}</td>
                      <td className="py-3.5 px-2 font-mono text-[10px]">{c.phone || 'N/A'}</td>
                      <td className="py-3.5 px-2">
                        <Badge variant={c.status === 'Active' ? 'success' : c.status === 'Lead' ? 'primary' : 'secondary'}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-2 text-right font-black text-slate-200">{formatCurrency(c.value || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        /* 2. Client Workspace detail view */
        <div className="space-y-6">
          {/* Workspace Back Button & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-450 hover:text-white cursor-pointer transition-all"
              >
                <IoArrowBackOutline size={16} />
              </button>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Client Workspace</span>
                <h1 className="text-2xl font-black text-white font-display mt-0.5">{selectedClient.companyName || selectedClient.name}</h1>
              </div>
            </div>
            
            {/* Quick Actions for Selected Client */}
            <div className="flex items-center gap-2">
              <Badge variant={selectedClient.status === 'Active' ? 'success' : selectedClient.status === 'Lead' ? 'primary' : 'secondary'}>
                Status: {selectedClient.status}
              </Badge>
              {selectedClient.status === 'Lead' && hasPermission('CRM', 'edit') && (
                <Button onClick={() => advanceStatus(selectedClient._id, 'Active')} size="sm" className="bg-[#22C55E] text-white hover:bg-[#1db053] text-[10px]">
                  Sign Contract
                </Button>
              )}
              {selectedClient.status === 'Active' && hasPermission('CRM', 'edit') && (
                <Button onClick={() => advanceStatus(selectedClient._id, 'Inactive')} size="sm" variant="secondary" className="border-slate-800 text-slate-350 hover:text-white text-[10px]">
                  Archive Account
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Details Card */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="space-y-4">
                <div className="flex flex-col items-center text-center pb-4 border-b border-slate-850">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#22C55E]/20 to-emerald-500/10 flex items-center justify-center font-display font-black text-slate-200 border border-slate-800 mb-3 text-xl">
                    {selectedClient.companyName ? selectedClient.companyName[0] : selectedClient.name[0]}
                  </div>
                  <h3 className="text-sm font-bold text-white">{selectedClient.name}</h3>
                  <span className="text-[10px] text-slate-500 mt-0.5">{selectedClient.companyName || 'Private Account'}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Contact Email</span>
                    <a href={`mailto:${selectedClient.email}`} className="text-slate-300 font-mono text-[11px] hover:text-[#22C55E]">{selectedClient.email}</a>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Phone Number</span>
                    <span className="text-slate-300 font-mono">{selectedClient.phone || 'Not Registered'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Office Address</span>
                    <span className="text-slate-300 leading-relaxed">{address}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Account Created</span>
                    <span className="text-slate-300">{new Date(selectedClient.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>

              {/* AI Account Summary Generator */}
              <Card className="border-[#22C55E]/10 bg-[#22C55E]/[0.02]">
                <div className="flex items-center gap-1.5 text-[#22C55E] mb-2 font-display">
                  <IoSparklesOutline size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">AI Client Summary</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Key partner interested in scaling compiler telemetry components. High contract growth prospects with outstanding feedback logs. Keep budget allocations tracked for Q3.
                </p>
              </Card>
            </div>

            {/* Workspace Operations Tabs */}
            <div className="lg:col-span-3 space-y-6">
              {/* Tab Selector */}
              <div className="flex border-b border-slate-800 gap-1 overflow-x-auto">
                {[
                  { key: 'info', label: 'Overview', icon: <IoBusinessOutline size={13} /> },
                  { key: 'projects', label: 'Projects & Specs', icon: <IoFolderOpenOutline size={13} /> },
                  { key: 'documents', label: 'Project Documents', icon: <IoBookOutline size={13} /> },
                  { key: 'meetings', label: 'Meeting & Delivery', icon: <IoCalendarOutline size={13} /> },
                  { key: 'billing', label: 'Billing Summary', icon: <IoCashOutline size={13} /> },
                  { key: 'timeline', label: 'Activity Logs', icon: <IoTimeOutline size={13} /> }
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveWorkspaceTab(t.key as any)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeWorkspaceTab === t.key 
                        ? 'border-[#22C55E] text-[#22C55E] bg-[#22C55E]/5' 
                        : 'border-transparent text-slate-450 hover:text-white'
                    }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Overview Workspace Tab */}
              {activeWorkspaceTab === 'info' && (
                <div className="space-y-6">
                  <Card>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Client Overview Brief</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {selectedClient.notes || 'No overview notes registered for this client account. Click edit settings to add a relationship overview brief.'}
                    </p>
                  </Card>

                  {/* Summary grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 flex flex-col justify-between">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Total Deal Value</span>
                      <h3 className="text-xl font-black text-white mt-1">{formatCurrency(selectedClient.value || 0)}</h3>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Active Projects</span>
                      <h3 className="text-xl font-black text-[#22C55E] mt-1">{clientProjects.length} Projects</h3>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Account Health</span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                        <span className="text-xs font-bold text-slate-200">Excellent</span>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Projects Workspace Tab */}
              {activeWorkspaceTab === 'projects' && (
                <div className="space-y-6">
                  <Card>
                    <div className="border-b border-slate-850 pb-3 mb-4 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Associated Projects</h3>
                      <span className="text-[10px] text-slate-500 font-bold">{clientProjects.length} projects linked</span>
                    </div>

                    {clientProjects.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">No projects currently linked to this client company.</p>
                    ) : (
                      <div className="space-y-3">
                        {clientProjects.map(p => (
                          <div key={p._id} className="p-4 border border-slate-850 bg-slate-950/20 rounded-xl flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-white">{p.name}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5">Timeline: {p.startDate} to {p.endDate}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-slate-200 block">{formatCurrency(p.budget)}</span>
                              <Badge variant={p.status === 'Active' ? 'success' : 'primary'}>{p.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Project SRS Documents */}
                  <Card>
                    <div className="border-b border-slate-850 pb-3 mb-4 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">System Specifications (SRS)</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 border border-slate-850 bg-slate-950/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IoDocumentTextOutline className="text-[#22C55E]" size={16} />
                          <div>
                            <h4 className="text-xs font-bold text-slate-200">Software Requirements Specification v1.2</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">Generated via AI Studio - Certified 30d ago</p>
                          </div>
                        </div>
                        <Button size="sm" variant="secondary" className="border-slate-800 text-slate-350 hover:text-white text-[10px]">View Spec</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Project Documents Tab */}
              {activeWorkspaceTab === 'documents' && (
                <Card>
                  <div className="border-b border-slate-850 pb-3 mb-4">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Workspace Files Directory</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-850 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                          <th className="py-2.5 px-2">Document Name</th>
                          <th className="py-2.5 px-2">Type</th>
                          <th className="py-2.5 px-2">Updated</th>
                          <th className="py-2.5 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Service Agreement Contract.pdf', type: 'Contract', date: 'Jul 04, 2026' },
                          { name: 'UI Figma Design Spec.png', type: 'Design', date: 'Jul 08, 2026' },
                          { name: 'Requirements Document v1.0.md', type: 'Requirement', date: 'Jul 10, 2026' },
                          { name: 'Initial Meeting Brief.txt', type: 'Meeting Notes', date: 'Jul 12, 2026' },
                          { name: 'Acceptance Report Sign-off.pdf', type: 'Deliverables', date: 'Jul 15, 2026' }
                        ].map((doc, idx) => (
                          <tr key={idx} className="border-b border-slate-850 hover:bg-slate-900/10 text-slate-300">
                            <td className="py-3 px-2 font-bold text-slate-200">{doc.name}</td>
                            <td className="py-3 px-2">
                              <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] font-semibold text-slate-400">
                                {doc.type}
                              </span>
                            </td>
                            <td className="py-3 px-2">{doc.date}</td>
                            <td className="py-3 px-2 text-right">
                              <button className="text-[#22C55E] hover:underline font-bold text-[10px] cursor-pointer">Open File</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* Meeting & Delivery Reports Tab */}
              {activeWorkspaceTab === 'meetings' && (
                <div className="space-y-6">
                  {/* Meetings Minutes */}
                  <Card>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">Meeting Minutes & AI Summaries</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 border border-slate-850 bg-slate-950/20 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <h4 className="font-bold text-white">Sprint Alignment Meeting</h4>
                          <span className="text-slate-500 font-mono">Jul 12, 2026</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          <span className="font-bold text-slate-350 block">AI Summary:</span>
                          Discussed the deployment pipeline targets and confirmed backend connectivity parameters. Resolved sitemap generation schema updates.
                        </p>
                        <p className="text-[11px] text-slate-400">
                          <span className="font-bold text-slate-350">Action Items:</span> Register sending metrics, verify sitemap, index documents.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Deliveries Status */}
                  <Card>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-850 pb-2">Delivery Reports</h3>
                    
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-4 border-b border-slate-850 pb-3">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Delivery Status</span>
                          <span className="text-[#22C55E] font-bold mt-1 inline-block">Phase 1 - Completed</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Completion Date</span>
                          <span className="text-slate-300 mt-1 inline-block">Jul 15, 2026</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Acceptance Notes & Delivery Comments</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Phase 1 dashboard interface was successfully signed off by the Client Executive with no outstanding design warnings. Codebase repository is checked in cleanly.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Billing Summary Tab */}
              {activeWorkspaceTab === 'billing' && (
                <div className="space-y-6">
                  {/* Billing Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="p-4 flex flex-col justify-between">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Total Amount Billed</span>
                      <h3 className="text-xl font-black text-white mt-1">{formatCurrency(selectedClient.value || 0)}</h3>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Paid to Date</span>
                      <h3 className="text-xl font-black text-emerald-400 mt-1">{formatCurrency((selectedClient.value || 0) * 0.7)}</h3>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Pending Dues</span>
                      <h3 className="text-xl font-black text-amber-500 mt-1">{formatCurrency((selectedClient.value || 0) * 0.3)}</h3>
                    </Card>
                  </div>

                  {/* Due details */}
                  <Card>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-855 pb-2">Due Date Checklist</h3>
                    <div className="flex items-center justify-between text-xs text-slate-350">
                      <span>Next Invoice Release Cycle</span>
                      <span className="font-bold text-white">Aug 01, 2026</span>
                    </div>
                  </Card>
                </div>
              )}

              {/* Timeline Workspace Tab */}
              {activeWorkspaceTab === 'timeline' && (
                <Card>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-6 border-b border-slate-850 pb-2">Chronological Activity History</h3>
                  
                  <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    {[
                      { icon: <IoShieldCheckmarkOutline size={12} />, title: 'Phase 1 Signed Off', desc: 'Client executive reviewed and signed the acceptance report.', date: 'Jul 15, 2026' },
                      { icon: <IoDocumentTextOutline size={12} />, title: 'Requirements Finalized', desc: 'AI specifications compiler checked version 1.2 specifications.', date: 'Jul 10, 2026' },
                      { icon: <IoCashOutline size={12} />, title: 'Retainer Invoice Cleared', desc: 'Retainer billing payment received and logged.', date: 'Jul 05, 2026' },
                      { icon: <IoFolderOpenOutline size={12} />, title: 'Account Initialized', desc: 'Created new account profile for client.', date: 'Jul 04, 2026' }
                    ].map((act, idx) => (
                      <div key={idx} className="flex gap-4 items-start relative pl-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[#22C55E] shrink-0 z-10">
                          {act.icon}
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-slate-250">{act.title}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">{act.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{act.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Client">
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Contact Name</label>
              <input
                type="text"
                required
                placeholder="Guillermo Rauch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Email Address</label>
              <input
                type="email"
                required
                placeholder="guillermo@vercel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Company Name</label>
              <input
                type="text"
                required
                placeholder="Vercel Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Office Address</label>
            <input
              type="text"
              placeholder="100 Vercel Way, San Francisco, CA"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Deal Value ({settings.currency})</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Client Stage</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 cursor-pointer"
              >
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Client Tags</label>
              <input
                type="text"
                placeholder="Enterprise, SaaS"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Notes</label>
            <textarea
              rows={3}
              placeholder="Record any client requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="text-xs bg-white text-[#111827] border border-[#22C55E]">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">
              Add Client
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CRM;
