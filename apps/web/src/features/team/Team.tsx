import React, { useState } from 'react';
import { Card, Badge, ProgressBar, Button, Modal, Drawer } from '../../components/UI';
import { 
  IoPeopleCircleOutline, 
  IoCalendarOutline, 
  IoCheckmarkCircleOutline, 
  IoTimeOutline, 
  IoMailOutline, 
  IoCallOutline,
  IoAlertCircleOutline,
  IoCheckmarkDoneOutline,
  IoCloseCircleOutline
} from 'react-icons/io5';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  tasks: number;
  capacity: number;
  avatar: string;
  email: string;
  phone: string;
  skills: string[];
}

interface LeaveRequest {
  id: string;
  name: string;
  duration: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  notes?: string;
}

export const Team: React.FC = () => {
  const [members] = useState<TeamMember[]>([
    { 
      id: '1', 
      name: 'Alexander Wright', 
      role: 'Administrator', 
      tasks: 3, 
      capacity: 60, 
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin',
      email: 'alex@stackpilot.ai',
      phone: '+91 98765 43210',
      skills: ['React', 'TypeScript', 'Node.js', 'System Architecture', 'Cloud Services']
    },
    { 
      id: '2', 
      name: 'Sarah Jenkins', 
      role: 'Project Manager', 
      tasks: 4, 
      capacity: 85, 
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
      email: 'sarah@stackpilot.ai',
      phone: '+91 98765 43211',
      skills: ['Sprint Planning', 'Client Relations', 'Agile Methodology', 'Budgeting']
    },
    { 
      id: '3', 
      name: 'Marcus Aurelius', 
      role: 'Lead Developer', 
      tasks: 6, 
      capacity: 95, 
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus',
      email: 'marcus@stackpilot.ai',
      phone: '+91 98765 43212',
      skills: ['Docker', 'MongoDB', 'React 19', 'Next.js', 'CI/CD Pipelines']
    },
    { 
      id: '4', 
      name: 'Tony Soprano', 
      role: 'Finance Lead', 
      tasks: 2, 
      capacity: 40, 
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tony',
      email: 'tony@stackpilot.ai',
      phone: '+91 98765 43213',
      skills: ['Corporate Invoicing', 'GST Calculations', 'Payroll Management', 'Risk Assessment']
    },
    { 
      id: '5', 
      name: 'Guillermo Rauch', 
      role: 'Client Executive', 
      tasks: 1, 
      capacity: 20, 
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Guillermo',
      email: 'guillermo@stackpilot.ai',
      phone: '+91 98765 43214',
      skills: ['Customer Success', 'Market Expansion', 'Vercel Deployment', 'UX Design']
    }
  ]);

  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    { id: 'l1', name: 'Sarah Jenkins', duration: 'Jul 4 - Jul 8', reason: 'Summer Vacation', status: 'Approved', notes: 'Pre-approved since Q2.' },
    { id: 'l2', name: 'Marcus Aurelius', duration: 'Jul 15 - Jul 16', reason: 'Medical Checkup', status: 'Pending', notes: '' }
  ]);

  // Form State
  const [leaveName, setLeaveName] = useState<string>('Sarah Jenkins');
  const [leaveDuration, setLeaveDuration] = useState<string>('');
  const [leaveReason, setLeaveReason] = useState<string>('');

  // Interactive Modals / Drawer State
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
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

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return 'bg-red-500';
    if (capacity >= 75) return 'bg-amber-500';
    return 'bg-[#22C55E]';
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-black font-display text-white tracking-tight">Team Hub</h1>
        <p className="text-xs text-slate-400 mt-1">Manage team workloads, view availability, and coordinate time-off requests.</p>
      </div>

      {/* Workforce Roster cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => (
          <Card 
            key={m.id} 
            onClick={() => setSelectedMember(m)}
            className="space-y-4 cursor-pointer hover:border-[#22C55E]/40 transition-all hover:scale-[1.01] hover:bg-slate-900/60"
          >
            <div className="flex items-center gap-3">
              <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">{m.name}</h4>
                <span className="text-[9px] text-[#22C55E] font-bold uppercase tracking-wider">{m.role}</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-800/40 pt-3">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>Active Tasks</span>
                <span className="text-slate-300">{m.tasks} tasks assigned</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Workload Capacity</span>
                  <span className={`${m.capacity >= 90 ? 'text-red-400' : 'text-slate-400'} font-bold`}>{m.capacity}%</span>
                </div>
                <ProgressBar value={m.capacity} color={getCapacityColor(m.capacity)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaves Table */}
        <Card className="lg:col-span-2">
          <div className="border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Time-Off Requests</h3>
            <p className="text-[9px] text-slate-500">Scheduled time-off and approval status. Click a request to review.</p>
          </div>

          <div className="space-y-3">
            {leaves.map((l) => (
              <div 
                key={l.id} 
                onClick={() => {
                  setSelectedLeave(l);
                  setDrawerNotes(l.notes || '');
                }}
                className="flex items-center justify-between p-4 bg-slate-950/20 border border-slate-850 rounded-xl hover:border-slate-700 cursor-pointer transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 mt-0.5">
                    <IoCalendarOutline size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{l.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{l.reason} ({l.duration})</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}>
                    {l.status}
                  </Badge>
                  {l.status === 'Pending' && (
                    <span className="text-[9px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
                      Review
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Leave Request form */}
        <Card>
          <div className="border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Request Time-Off</h3>
            <p className="text-[9px] text-slate-500">Submit a request for scheduled time-off.</p>
          </div>

          <form onSubmit={handleCreateLeave} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Team Member</label>
              <select
                value={leaveName}
                onChange={(e) => setLeaveName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 cursor-pointer"
              >
                {members.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Dates</label>
              <input
                type="text"
                required
                placeholder="e.g. Aug 10 - Aug 14"
                value={leaveDuration}
                onChange={(e) => setLeaveDuration(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Reason</label>
              <input
                type="text"
                required
                placeholder="e.g. Family wedding trip"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>

            <Button type="submit" className="w-full text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">Submit Request</Button>
          </form>
        </Card>
      </div>

      {/* Team Member Profile Details Modal */}
      {selectedMember && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMember(null)}
          title="Team Member Profile"
          size="md"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-850 pb-4">
              <img 
                src={selectedMember.avatar} 
                alt={selectedMember.name} 
                className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800" 
              />
              <div>
                <h3 className="text-sm font-bold text-white">{selectedMember.name}</h3>
                <span className="text-[10px] text-[#22C55E] font-black uppercase tracking-wider">{selectedMember.role}</span>
                
                <div className="flex flex-col gap-1 mt-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1.5"><IoMailOutline size={12} /> {selectedMember.email}</span>
                  <span className="flex items-center gap-1.5"><IoCallOutline size={12} /> {selectedMember.phone}</span>
                </div>
              </div>
            </div>

            {/* Workload */}
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Workload Telemetry</span>
              <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-850 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Active Task Deliverables:</span>
                  <span className="font-bold text-white">{selectedMember.tasks} tasks assigned</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Capacity Threshold:</span>
                    <span className="font-semibold">{selectedMember.capacity}%</span>
                  </div>
                  <ProgressBar value={selectedMember.capacity} color={getCapacityColor(selectedMember.capacity)} />
                </div>
              </div>
            </div>

            {/* Core Skills */}
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Core Skills & Specialties</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMember.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-bold text-slate-350">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end border-t border-slate-850 pt-4 mt-2">
              <Button onClick={() => setSelectedMember(null)} className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">
                Close Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Leave Approval/Rejection Drawer Panel */}
      {selectedLeave && (
        <Drawer
          isOpen={true}
          onClose={() => setSelectedLeave(null)}
          title="Review Time-Off Request"
        >
          <div className="space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-5">
              <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Applicant</span>
                  <Badge variant={selectedLeave.status === 'Approved' ? 'success' : selectedLeave.status === 'Rejected' ? 'danger' : 'warning'}>
                    {selectedLeave.status}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-white">{selectedLeave.name}</h4>
                <div className="text-[10px] text-slate-400 leading-relaxed pt-1.5 border-t border-slate-850/60 mt-1.5 space-y-1">
                  <div><strong className="text-slate-350">Duration:</strong> {selectedLeave.duration}</div>
                  <div><strong className="text-slate-350">Reason:</strong> {selectedLeave.reason}</div>
                </div>
              </div>

              {/* Notes Input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reviewer Notes</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Approved. Coverage arranged for during sprint release window."
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50 resize-none leading-relaxed"
                />
              </div>

              {selectedLeave.notes && (
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-lg text-[10px] text-slate-500 italic">
                  Previous log note: {selectedLeave.notes}
                </div>
              )}
            </div>

            {/* Actions panel */}
            <div className="space-y-2 border-t border-slate-850 pt-4 mt-8">
              {selectedLeave.status === 'Pending' ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleRejectLeave(selectedLeave.id)} 
                    variant="secondary"
                    className="text-xs bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <IoCloseCircleOutline size={14} className="mr-1 inline-block" /> Reject Request
                  </Button>
                  <Button 
                    onClick={() => handleApproveLeave(selectedLeave.id)} 
                    className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white"
                  >
                    <IoCheckmarkDoneOutline size={14} className="mr-1 inline-block" /> Approve Request
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setSelectedLeave(null)}
                  className="w-full text-xs bg-slate-900 border border-slate-800 text-slate-350 hover:bg-slate-850"
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

export default Team;
