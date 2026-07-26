import React, { useState } from 'react';
import { Card, Badge, Button, Drawer } from '../../components/UI';
import { 
  IoCalendarOutline, 
  IoCheckmarkDoneOutline, 
  IoCloseCircleOutline,
  IoAddOutline
} from 'react-icons/io5';

interface LeaveRequest {
  id: string;
  name: string;
  duration: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  notes?: string;
}

export const LeaveManagement: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    { id: 'l1', name: 'Sarah Jenkins', duration: 'Jul 4 - Jul 8', reason: 'Summer Vacation', status: 'Approved', notes: 'Pre-approved since Q2.' },
    { id: 'l2', name: 'Marcus Aurelius', duration: 'Jul 15 - Jul 16', reason: 'Medical Checkup', status: 'Pending', notes: '' },
    { id: 'l3', name: 'Alexander Wright', duration: 'Aug 20 - Aug 22', reason: 'Conference Attendance', status: 'Approved', notes: 'Tech summit presentation.' }
  ]);

  // Form State
  const [leaveName, setLeaveName] = useState<string>('Sarah Jenkins');
  const [leaveDuration, setLeaveDuration] = useState<string>('');
  const [leaveReason, setLeaveReason] = useState<string>('');

  // Drawer State
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [drawerNotes, setDrawerNotes] = useState<string>('');

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDuration || !leaveReason) return;
    
    const newLeave: LeaveRequest = {
      id: `l-${Date.now()}`,
      name: leaveName,
      duration: leaveDuration,
      reason: leaveReason,
      status: 'Pending',
      notes: ''
    };

    setLeaves([...leaves, newLeave]);
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

  return (
    <div className="space-y-8 pb-12">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">Leave Management</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Review scheduled time-off, manage leave approvals, and record team coverage notes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaves Table */}
        <Card className="lg:col-span-2">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Time-Off Requests</h3>
            <p className="text-[10px] text-slate-500">Scheduled time-off and approval status. Click a request to review details.</p>
          </div>

          <div className="space-y-3">
            {leaves.map((l) => (
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
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{l.name}</h4>
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
            ))}
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
              <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Dates</label>
              <input
                type="text"
                required
                placeholder="e.g. Aug 10 - Aug 14"
                value={leaveDuration}
                onChange={(e) => setLeaveDuration(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none"
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
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none"
              />
            </div>

            <Button type="submit" className="w-full text-xs">Submit Request</Button>
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
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none resize-none leading-relaxed"
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
                    className="text-xs"
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
