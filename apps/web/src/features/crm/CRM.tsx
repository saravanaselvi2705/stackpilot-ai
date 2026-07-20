import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Button, Badge, Modal } from '../../components/UI';
import { IoAdd, IoMailOutline, IoCallOutline, IoBusinessOutline, IoFunnelOutline } from 'react-icons/io5';
import API from '../../services/api';
import type { Client } from '../../../../../packages/shared/types';

export const CRM: React.FC = () => {
  const [leads, setLeads] = useState<Client[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'clients';
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // New Lead Form State
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [value, setValue] = useState<number>(50000);
  const [status, setStatus] = useState<'Lead' | 'Active' | 'Inactive'>('Lead');
  const [tags, setTags] = useState<string>('Enterprise');
  const [notes, setNotes] = useState<string>('');

  const loadLeads = async () => {
    try {
      const data = await API.crm.listLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.crm.createLead({
        name,
        email,
        companyName,
        phone,
        value,
        status,
        tags: tags.split(',').map(t => t.trim()),
        notes
      });
      // Clear forms
      setName('');
      setEmail('');
      setCompanyName('');
      setPhone('');
      setValue(50000);
      setStatus('Lead');
      setTags('Enterprise');
      setNotes('');
      
      setModalOpen(false);
      loadLeads();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const advanceLeadStatus = async (leadId: string, nextStatus: 'Lead' | 'Active' | 'Inactive') => {
    try {
      await API.crm.updateLead(leadId, { status: nextStatus });
      loadLeads();
    } catch (err) {
      console.error(err);
    }
  };

  // Group leads by pipeline phase
  const pipelineStages = [
    { key: 'Lead', title: 'Leads', border: 'border-[#22C55E]/20', bg: 'bg-[#22C55E]/5', color: 'text-[#22C55E]' },
    { key: 'Active', title: 'Active Clients', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', color: 'text-emerald-400' },
    { key: 'Inactive', title: 'Inactive Clients', border: 'border-slate-800', bg: 'bg-slate-900/10', color: 'text-slate-500' }
  ];

  const filteredPipelineStages = pipelineStages.filter(stage => {
    if (activeTab === 'clients') return stage.key === 'Active';
    if (activeTab === 'leads') return stage.key === 'Lead';
    return true; // Show all stages for Contacts
  });

  return (
    <div className="space-y-8">
      {/* CRM Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Clients</h1>
          <p className="text-xs text-slate-400 mt-1">Add and track your clients and accounts here.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white">
          <IoAdd size={16} /> Add Client
        </Button>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSearchParams({ tab: 'clients' })}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'clients'
              ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 shadow-inner'
              : 'text-slate-450 hover:text-white border border-transparent'
          }`}
        >
          Clients
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'leads' })}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'leads'
              ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 shadow-inner'
              : 'text-slate-450 hover:text-white border border-transparent'
          }`}
        >
          Leads
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'contacts' })}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'contacts'
              ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 shadow-inner'
              : 'text-slate-450 hover:text-white border border-transparent'
          }`}
        >
          Contacts
        </button>
      </div>

      {/* Visual Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPipelineStages.map((stage) => {
          const stageLeads = leads.filter(l => l.status === stage.key);
          const stageTotalValue = stageLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);

          return (
            <div key={stage.key} className={`rounded-2xl border ${stage.border} ${stage.bg} p-5 flex flex-col min-h-[420px]`}>
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/40">
                <div>
                  <h3 className={`text-xs font-bold ${stage.color} tracking-wider uppercase`}>{stage.title}</h3>
                  <span className="text-[10px] text-slate-500">{stageLeads.length} accounts</span>
                </div>
                <span className="text-xs font-black text-slate-300">₹{stageTotalValue.toLocaleString()}</span>
              </div>

              {/* Lead Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-10 text-[10px] text-slate-600">No accounts in this phase</div>
                ) : (
                  stageLeads.map((l) => (
                    <div key={l._id} className="p-4 bg-slate-900/90 border border-slate-850 rounded-xl space-y-3 hover:border-slate-700 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-100">{l.name}</h4>
                          <span className="text-[9px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                            <IoBusinessOutline size={10} /> {l.companyName}
                          </span>
                        </div>
                        <span className="text-xs font-black text-[#22C55E]">₹{l.value?.toLocaleString()}</span>
                      </div>

                      {l.notes && <p className="text-[10px] text-slate-400 leading-relaxed truncate">{l.notes}</p>}

                      <div className="flex flex-wrap gap-1">
                        {l.tags?.map(t => (
                          <span key={t} className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-[8px] text-slate-300 font-bold rounded">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Client Communication buttons */}
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5 mt-1.5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <a href={`mailto:${l.email}`} title={l.email} className="hover:text-[#22C55E] transition-colors">
                            <IoMailOutline size={14} />
                          </a>
                          {l.phone && (
                            <a href={`tel:${l.phone}`} title={l.phone} className="hover:text-[#22C55E] transition-colors">
                              <IoCallOutline size={14} />
                            </a>
                          )}
                        </div>

                        {/* Status Advancement Triggers */}
                        <div className="flex items-center gap-1.5">
                          {stage.key === 'Lead' && (
                            <button 
                              onClick={() => advanceLeadStatus(l._id, 'Active')}
                              className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 px-2 py-0.5 rounded transition-all cursor-pointer"
                            >
                              Sign Client
                            </button>
                          )}
                          {stage.key === 'Active' && (
                            <button 
                              onClick={() => advanceLeadStatus(l._id, 'Inactive')}
                              className="text-[9px] font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 border border-slate-750 px-2 py-0.5 rounded transition-all cursor-pointer"
                            >
                              Archive
                            </button>
                          )}
                          {stage.key === 'Inactive' && (
                            <button 
                              onClick={() => advanceLeadStatus(l._id, 'Lead')}
                              className="text-[9px] font-bold text-[#22C55E] bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/25 px-2 py-0.5 rounded transition-all cursor-pointer"
                            >
                              Reopen Lead
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Leads Table Summary */}
      <Card>
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <h3 className="text-sm font-bold text-slate-200">Client Directory</h3>
          <IoFunnelOutline className="text-slate-500 cursor-pointer hover:text-white" size={16} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                <th className="py-3 px-2">Contact Name</th>
                <th className="py-3 px-2">Company Name</th>
                <th className="py-3 px-2">Email Address</th>
                <th className="py-3 px-2">Phone No.</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Deal Value</th>
              </tr>
            </thead>
            <tbody>
              {leads.filter(l => {
                if (activeTab === 'clients') return l.status === 'Active';
                if (activeTab === 'leads') return l.status === 'Lead';
                return true; // Show all for Contacts
              }).map((l) => (
                <tr key={l._id} className="border-b border-slate-800/40 hover:bg-slate-900/10 text-slate-300">
                  <td className="py-3.5 px-2 font-semibold text-white">{l.name}</td>
                  <td className="py-3.5 px-2">{l.companyName || 'Internal'}</td>
                  <td className="py-3.5 px-2 font-mono text-[10px]">{l.email}</td>
                  <td className="py-3.5 px-2 font-mono text-[10px]">{l.phone || 'N/A'}</td>
                  <td className="py-3.5 px-2">
                    <Badge variant={l.status === 'Active' ? 'success' : l.status === 'Lead' ? 'primary' : 'secondary'}>
                      {l.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-2 text-right font-black text-slate-200">₹{(l.value || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Lead Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Client">
        <form onSubmit={handleCreateLead} className="space-y-4">
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Value (₹)</label>
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
                onChange={(e) => setStatus(e.target.value as 'Lead' | 'Active' | 'Inactive')}
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
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Conversation Notes</label>
            <textarea
              rows={3}
              placeholder="Record any client requests, budget considerations, or meeting feedback..."
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
