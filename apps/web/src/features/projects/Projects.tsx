import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, ProgressBar, Modal } from '../../components/UI';
import { IoAdd, IoCalendarOutline, IoTrendingUpOutline, IoTrendingDownOutline, IoAlertCircleOutline } from 'react-icons/io5';
import API from '../../services/api';
import type { Project } from '../../../../../packages/shared/types';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [budget, setBudget] = useState<number>(50000);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [client, setClient] = useState<string>('');

  const loadProjects = async () => {
    try {
      const list = await API.projects.list();
      setProjects(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.projects.create({
        name,
        description,
        priority,
        budget,
        startDate,
        endDate,
        client
      });
      setName('');
      setDescription('');
      setPriority('Medium');
      setBudget(50000);
      setStartDate('');
      setEndDate('');
      setClient('');
      
      setModalOpen(false);
      loadProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getHealthBadge = (health: string) => {
    if (health === 'Healthy') return <Badge variant="success">Healthy</Badge>;
    if (health === 'At Risk') return <Badge variant="warning">At Risk</Badge>;
    return <Badge variant="danger">Critical</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Projects</h1>
          <p className="text-xs text-slate-400 mt-1">Manage project timelines, budgets, and milestones.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white">
          <IoAdd size={16} /> Create Project
        </Button>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.map((p) => {
          const percentSpent = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;

          return (
            <Card key={p._id} className="flex flex-col justify-between h-[300px]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white truncate max-w-[150px]">{p.name}</h3>
                  {getHealthBadge(p.health)}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-3">
                  {p.description}
                </p>
              </div>

              <div className="space-y-4">
                {/* Budget spent */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                    <span>Spent vs Budget</span>
                    <span>${p.spent.toLocaleString()} / ${p.budget.toLocaleString()} ({percentSpent}%)</span>
                  </div>
                  <ProgressBar value={percentSpent} color={percentSpent > 80 ? 'bg-red-500' : 'bg-[#22C55E]'} />
                </div>

                {/* Timeline metadata */}
                <div className="flex items-center justify-between border-t border-slate-800/40 pt-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <IoCalendarOutline size={12} className="text-slate-400" />
                    {new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(p.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="font-bold text-slate-400 capitalize">{p.client || 'Internal'}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Gantt Timeline Simulation */}
      <Card>
        <div className="border-b border-slate-800 pb-4 mb-6">
          <h3 className="text-sm font-bold text-slate-200">Project Timeline</h3>
          <p className="text-[10px] text-slate-400">Visual schedule of all active projects.</p>
        </div>

        <div className="space-y-6">
          {/* Header Row */}
          <div className="grid grid-cols-12 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-2">
            <span className="col-span-3 text-left">Project Title</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
            <span>Jan</span>
            <span>Feb</span>
          </div>

          {/* Timeline Rows */}
          {projects.map((p, idx) => {
            // Simulated offset grids depending on project ID or index
            const startCol = idx === 0 ? 4 : idx === 1 ? 5 : 3;
            const widthCols = idx === 0 ? 4 : idx === 1 ? 5 : 3;

            return (
              <div key={p._id} className="grid grid-cols-12 items-center text-xs">
                <span className="col-span-3 text-slate-300 font-semibold truncate">{p.name}</span>
                <div className="col-span-9 grid grid-cols-9 h-6 relative bg-slate-900/10 rounded-lg overflow-hidden">
                  <div 
                    className="h-full rounded-md bg-gradient-to-r from-[#22C55E]/25 to-[#22C55E] border-l-2 border-[#22C55E] shadow-md shadow-[#22C55E]/10 flex items-center px-3"
                    style={{ gridColumnStart: startCol, gridColumnEnd: startCol + widthCols }}
                  >
                    <span className="text-[9px] font-bold text-emerald-200 truncate">{p.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Deploy Project Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Project Title</label>
            <input
              type="text"
              required
              placeholder="Next.js Performance Compiler Hooks"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the project goals and details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Budget ($)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Client</label>
              <input
                type="text"
                placeholder="Vercel Inc."
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="text-xs bg-white text-[#111827] border border-[#22C55E]">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Projects;
