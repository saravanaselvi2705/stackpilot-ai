import React, { useState, useEffect } from 'react';
import { API } from '../../services/api';
import type { ApprovalRequest } from '../../../../../packages/shared/types';
import { 
  IoShieldCheckmarkOutline, 
  IoCheckmarkCircleOutline, 
  IoCloseCircleOutline, 
  IoAddOutline,
  IoTimeOutline,
  IoCloseOutline
} from 'react-icons/io5';

export const Approvals: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [activeTab, setActiveTab] = useState<string>('Pending');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New Form
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ApprovalRequest['type']>('Leave Approval');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const list = await API.approvals.list();
      setApprovals(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      await API.approvals.updateStatus(id, status, `Reviewed and ${status.toLowerCase()} by Super Admin.`);
      fetchApprovals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await API.approvals.create({
        type,
        title,
        description,
        requestedBy: 'u-1',
        requestedByName: 'Super Admin',
        approverId: 'u-1',
        approverName: 'Super Admin Manager',
        amount: amount || undefined
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setAmount(0);
      fetchApprovals();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredApprovals = approvals.filter(a => {
    if (activeTab === 'All') return true;
    return a.status === activeTab;
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
            <IoShieldCheckmarkOutline size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Automated Approval Engine</h1>
            <p className="text-xs text-slate-500 font-medium">Manage Leave, Expense, Invoice, Timesheet & Project Approvals.</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <IoAddOutline size={18} />
          <span>New Approval Request</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['Pending', 'Approved', 'Rejected', 'All'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
              activeTab === tab ? 'bg-purple-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab} Requests {tab === 'Pending' && `(${approvals.filter(a => a.status === 'Pending').length})`}
          </button>
        ))}
      </div>

      {/* Approval Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-bold text-xs">Loading approvals...</div>
        ) : filteredApprovals.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium text-xs">No {activeTab} approval requests found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredApprovals.map(a => (
              <div key={a._id} className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">{a.type}</span>
                    <h3 className="text-sm font-black text-slate-900 truncate">{a.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{a.description}</p>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                    <span>Requested by: {a.requestedByName}</span>
                    <span>Approver: {a.approverName}</span>
                    {a.amount ? <span className="text-slate-900 font-extrabold">Amount: ${a.amount.toLocaleString()}</span> : null}
                    <span>Date: {new Date(a.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                    a.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    a.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {a.status}
                  </span>

                  {a.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(a._id, 'Approved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <IoCheckmarkCircleOutline size={16} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(a._id, 'Rejected')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <IoCloseCircleOutline size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateApproval} className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Submit Approval Request</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <IoCloseOutline size={20} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Approval Category</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                >
                  {['Leave Approval', 'Expense Approval', 'Invoice Approval', 'Purchase Approval', 'Quotation Approval', 'Timesheet Approval', 'Document Approval', 'Project Approval'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Request Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                  placeholder="e.g. Q3 AWS Cloud Infrastructure Expense"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount ($ optional)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                  placeholder="1450"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Rationale</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none"
                  placeholder="Enter details..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-extrabold text-xs">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Approvals;
