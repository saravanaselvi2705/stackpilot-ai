import React, { useState } from 'react';
import { Card, ProgressBar, Button, Modal } from '../../components/UI';
import { 
  IoMailOutline, 
  IoCallOutline
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

  // Modal State
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return 'bg-red-500';
    if (capacity >= 75) return 'bg-amber-500';
    return 'bg-[#22C55E]';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">Team Members</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Manage workforce roster, review skill profiles, and balance workload telemetry.</p>
      </div>

      {/* Workforce Roster cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => (
          <Card 
            key={m.id} 
            onClick={() => setSelectedMember(m)}
            className="space-y-4 cursor-pointer hover:border-[#22C55E]/50 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{m.name}</h4>
                <span className="text-[10px] text-[#22C55E] font-bold uppercase tracking-wider">{m.role}</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold">
                <span>Active Deliverables</span>
                <span className="text-slate-900 dark:text-slate-200 font-bold">{m.tasks} tasks</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Workload Capacity</span>
                  <span className={`${m.capacity >= 90 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'} font-bold`}>{m.capacity}%</span>
                </div>
                <ProgressBar value={m.capacity} color={getCapacityColor(m.capacity)} />
              </div>
            </div>
          </Card>
        ))}
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
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <img 
                src={selectedMember.avatar} 
                alt={selectedMember.name} 
                className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" 
              />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedMember.name}</h3>
                <span className="text-[10px] text-[#22C55E] font-black uppercase tracking-wider">{selectedMember.role}</span>
                
                <div className="flex flex-col gap-1 mt-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><IoMailOutline size={14} /> {selectedMember.email}</span>
                  <span className="flex items-center gap-1.5"><IoCallOutline size={14} /> {selectedMember.phone}</span>
                </div>
              </div>
            </div>

            {/* Workload */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Workload Telemetry</span>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Active Task Deliverables:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedMember.tasks} tasks assigned</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Capacity Threshold:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedMember.capacity}%</span>
                  </div>
                  <ProgressBar value={selectedMember.capacity} color={getCapacityColor(selectedMember.capacity)} />
                </div>
              </div>
            </div>

            {/* Core Skills */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Core Skills & Specialties</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMember.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
              <Button onClick={() => setSelectedMember(null)} className="text-xs">
                Close Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Team;
