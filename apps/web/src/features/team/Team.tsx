import React, { useState } from 'react';
import { Card, Badge, ProgressBar, Button } from '../../components/UI';
import { IoPeopleCircleOutline, IoCalendarOutline, IoCheckmarkCircleOutline, IoTimeOutline } from 'react-icons/io5';

export const Team: React.FC = () => {
  const [members, setMembers] = useState([
    { id: '1', name: 'Alexander Wright', role: 'Administrator', tasks: 3, capacity: 60, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin' },
    { id: '2', name: 'Sarah Jenkins', role: 'Project Manager', tasks: 4, capacity: 85, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah' },
    { id: '3', name: 'Marcus Aurelius', role: 'Lead Developer', tasks: 6, capacity: 95, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus' },
    { id: '4', name: 'Tony Soprano', role: 'Finance Lead', tasks: 2, capacity: 40, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tony' },
    { id: '5', name: 'Guillermo Rauch', role: 'Client Executive', tasks: 1, capacity: 20, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Guillermo' }
  ]);

  const [leaves, setLeaves] = useState([
    { id: 'l1', name: 'Sarah Jenkins', duration: 'Jul 4 - Jul 8', reason: 'Summer Vacation', status: 'Approved' },
    { id: 'l2', name: 'Marcus Aurelius', duration: 'Jul 15 - Jul 16', reason: 'Medical Checkup', status: 'Pending' }
  ]);

  // Form State
  const [leaveName, setLeaveName] = useState<string>('Sarah Jenkins');
  const [leaveDuration, setLeaveDuration] = useState<string>('');
  const [leaveReason, setLeaveReason] = useState<string>('');

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDuration || !leaveReason) return;
    
    const newLeave = {
      id: `l-${Date.now()}`,
      name: leaveName,
      duration: leaveDuration,
      reason: leaveReason,
      status: 'Pending'
    };

    setLeaves([...leaves, newLeave]);
    setLeaveDuration('');
    setLeaveReason('');
  };

  const handleApproveLeave = (id: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'Approved' } : l));
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
        <h1 className="text-3xl font-black font-display text-white tracking-tight">Team</h1>
        <p className="text-xs text-slate-400 mt-1">Manage team workloads, view availability, and coordinate time-off requests.</p>
      </div>

      {/* Workforce Roster cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => (
          <Card key={m.id} className="space-y-4">
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
            <p className="text-[9px] text-slate-500">Scheduled time-off and approval status.</p>
          </div>

          <div className="space-y-3">
            {leaves.map((l) => (
              <div key={l.id} className="flex items-center justify-between p-4 bg-slate-950/20 border border-slate-850 rounded-xl">
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
                  <Badge variant={l.status === 'Approved' ? 'success' : 'warning'}>{l.status}</Badge>
                  {l.status === 'Pending' && (
                    <button 
                      onClick={() => handleApproveLeave(l.id)}
                      className="text-[10px] font-bold text-[#22C55E] hover:text-[#1db053] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                    >
                      Approve
                    </button>
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
    </div>
  );
};
export default Team;
