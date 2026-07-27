import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Drawer } from '../../components/UI';
import { 
  IoCalendarOutline, 
  IoCheckmarkDoneOutline, 
  IoCloseCircleOutline,
  IoAddOutline,
  IoTimeOutline
} from 'react-icons/io5';

export interface LeaveRequest {
  id: string;
  name: string;
  leaveType: 'Casual' | 'Sick' | 'Earned' | 'Unpaid';
  duration: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  notes?: string;
  createdAt: string;
}

export const LeaveManagement: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('stackpilot_leaves');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'l1', name: 'Sarah Jenkins', leaveType: 'Casual', duration: 'Jul 4 - Jul 8', reason: 'Summer Vacation', status: 'Approved', notes: 'Pre-approved since Q2.', createdAt: '2026-07-01' },
      { id: 'l2', name: 'Marcus Aurelius', leaveType: 'Sick', duration: 'Jul 15 - Jul 16', reason: 'Medical Checkup', status: 'Pending', notes: '', createdAt: '2026-07-10' },
      { id: 'l3', name: 'Alexander Wright', leaveType: 'Earned', duration: 'Aug 20 - Aug 22', reason: 'Conference Attendance', status: 'Approved', notes: 'Tech summit presentation.', createdAt: '2026-07-12' }
    ];
  });

  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  // Form State
  const [leaveName, setLeaveName] = useState<string>('Sarah Jenkins');
  const [leaveType, setLeaveType] = useState<'Casual' | 'Sick' | 'Earned' | 'Unpaid'>('Casual');
  const [leaveDuration, setLeaveDuration] = useState<string>('');
  const [leaveReason, setLeaveReason] = useState<string>('');

  // Drawer State
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [drawerNotes, setDrawerNotes] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('stackpilot_leaves', JSON.stringify(leaves));
  }, [leaves]);

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDuration || !leaveReason) return;
    
    const newLeave: LeaveRequest = {
      id: `l-${Date.now()}`,
      name: leaveName,
      leaveType,
      duration: leaveDuration,
      reason: leaveReason,
      status: 'Pending',
      notes: '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setLeaves([newLeave, ...leaves]);
    setLeaveDuration('');
    setLeaveReason('');
  };

  const handleApproveLeave = (id: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'Approved', notes: drawerNotes } : l));
    setSelectedLeave(null);
    setDrawerNotes('');
  };

  const handleRejectLeave = (id: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'Rejected', notes: drawerNotes } : l));
    setSelectedLeave(null);
    setDrawerNotes('');
  };

  const filteredLeaves = leaves.filter(l => activeTab === 'All' || l.status === activeTab);

  // Dynamic balance calculations
  const approvedCasualCount = leaves.filter(l => l.leaveType === 'Casual' && l.status === 'Approved').length;
  const approvedSickCount = leaves.filter(l => l.leaveType === 'Sick' && l.status === 'Approved').length;
  const approvedEarnedCount = leaves.filter(l => l.leaveType === 'Earned' && l.status === 'Approved').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">Leave Management</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Review scheduled time-off, manage leave approvals, and record team coverage notes.</p>
      </div>

      {/* Leave Balance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-4 flex items-center justify-between border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Casual Leave</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-display mt-0.5">{12 - approvedCasualCount} / 12 Days</h3>
            <span className="text-[9px] text-[#22C55E] font-bold mt-1 block">Annual Allowance</span>
          </div>
          <div className="p-3 bg-[#22C55E]/10 text-[#22C55E] rounded-xl">
            <IoTimeOutline size={20} />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Sick Leave</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-display mt-0.5">{10 - approvedSickCount} / 10 Days</h3>
            <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold mt-1 block">Medical Coverage</span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <IoCalendarOutline size={20} />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Earned / Paid Leave</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-display mt-0.5">{20 - approvedEarnedCount} / 20 Days</h3>
            <span className="text-[9px] text-purple-600 dark:text-purple-400 font-bold mt-1 block">Accumulated PTO</span>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <IoCheckmarkDoneOutline size={20} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaves Table */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Time-Off Requests</h3>
              <p className="text-[10px] text-slate-500">Scheduled time-off and approval status. Click a request to review details.</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === tab 
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredLeaves.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-8">No time-off requests under this status filter.</p>
            ) : (
              filteredLeaves.map((l) => (
                <div 
                  key={l.id} 
                  onClick={() => {
                    setSelectedLeave(l);
                    setDrawerNotes(l.notes || '');
                  }}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-[#22C55E]/50 cursor-pointer transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-emerald-500/10 text-[#22C55E] rounded-lg mt-0.5">
                      <IoCalendarOutline size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{l.name}</h4>
                        <Badge variant="primary" className="text-[8px]">{l.leaveType || 'Casual'}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{l.reason} ({l.duration})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}>
                      {l.status}
                    </Badge>
                    {l.status === 'Pending' && (
                      <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
                        Review
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Submit Leave Request Form */}
        <Card>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 flex items-center gap-2">
            <IoAddOutline size={18} className="text-[#22C55E]" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Request Time-Off</h3>
              <p className="text-[10px] text-slate-500">Submit a request for scheduled time-off.</p>
            </div>
          </div>

          <form onSubmit={handleCreateLeave} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Team Member</label>
              <select
                value={leaveName}
                onChange={(e) => setLeaveName(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="Alexander Wright">Alexander Wright</option>
                <option value="Sarah Jenkins">Sarah Jenkins</option>
                <option value="Marcus Aurelius">Marcus Aurelius</option>
                <option value="Tony Soprano">Tony Soprano</option>
                <option value="Guillermo Rauch">Guillermo Rauch</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Leave Category</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="Casual">Casual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Earned">Earned / Paid Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Dates</label>
              <input
                type="text"
                required
                placeholder="e.g. Aug 10 - Aug 14"
                value={leaveDuration}
                onChange={(e) => setLeaveDuration(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Reason</label>
              <input
                type="text"
                required
                placeholder="e.g. Family trip / Medical leave"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]"
              />
            </div>

            <Button type="submit" className="w-full text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">Submit Request</Button>
          </form>
        </Card>
      </div>

      {/* Review Drawer Panel */}
      {selectedLeave && (
        <Drawer
          isOpen={true}
          onClose={() => setSelectedLeave(null)}
          title="Review Time-Off Request"
        >
          <div className="space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Applicant</span>
                  <Badge variant={selectedLeave.status === 'Approved' ? 'success' : selectedLeave.status === 'Rejected' ? 'danger' : 'warning'}>
                    {selectedLeave.status}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{selectedLeave.name}</h4>
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-800 mt-2 space-y-1">
                  <div><strong>Category:</strong> {selectedLeave.leaveType || 'Casual'}</div>
                  <div><strong>Duration:</strong> {selectedLeave.duration}</div>
                  <div><strong>Reason:</strong> {selectedLeave.reason}</div>
                </div>
              </div>

              {/* Reviewer Notes */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Reviewer Notes</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Approved. Coverage arranged for sprint window."
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none resize-none leading-relaxed focus:border-[#22C55E]"
                />
              </div>

              {selectedLeave.notes && (
                <div className="p-3 bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 italic">
                  Previous log note: {selectedLeave.notes}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4 mt-8">
              {selectedLeave.status === 'Pending' ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleRejectLeave(selectedLeave.id)} 
                    variant="danger"
                    className="text-xs"
                  >
                    <IoCloseCircleOutline size={16} className="mr-1 inline-block" /> Reject Request
                  </Button>
                  <Button 
                    onClick={() => handleApproveLeave(selectedLeave.id)} 
                    className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white"
                  >
                    <IoCheckmarkDoneOutline size={16} className="mr-1 inline-block" /> Approve Request
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setSelectedLeave(null)}
                  variant="secondary"
                  className="w-full text-xs"
                >
                  Close Review
                </Button>
              )}
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default LeaveManagement;
