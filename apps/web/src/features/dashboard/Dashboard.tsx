import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../services/api';
import type { Task, Project, Sprint, ApprovalRequest, ActivityLog } from '../../../../../packages/shared/types';
import { 
  IoSpeedometerOutline, 
  IoFlashOutline, 
  IoFolderOpenOutline, 
  IoCashOutline, 
  IoShieldCheckmarkOutline, 
  IoTimeOutline, 
  IoSparklesOutline, 
  IoCalendarOutline, 
  IoCheckmarkCircleOutline, 
  IoArrowForwardOutline,
  IoAlertCircleOutline,
  IoDownloadOutline
} from 'react-icons/io5';
import PresentationDownloadModal from '../../components/PresentationDownloadModal';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [isPresModalOpen, setIsPresModalOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [tData, pData, spData, apData, actData] = await Promise.all([
          API.tasks.list(),
          API.projects.list(),
          API.sprints.list(),
          API.approvals.list(),
          API.auditLogs.list()
        ]);
        setTasks(tData);
        setProjects(pData);
        setSprints(spData);
        setApprovals(apData);
        setActivities(actData);
      } catch (err) {
        console.error('Failed to load operational dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const activeSprint = sprints.find(s => s.status === 'Active') || sprints[0];
  const pendingApprovals = approvals.filter(a => a.status === 'Pending');
  const todayTasks = tasks.filter(t => t.status === 'In Progress' || t.status === 'Todo').slice(0, 5);
  const activeProjects = projects.filter(p => p.status === 'Active');

  const totalRevenue = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-bold text-sm animate-pulse flex items-center justify-center min-h-[400px]">
        Loading StackPilot Business OS Operations Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">Business OS v1.1 Operational Workspace</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-slate-300">Here is your daily organization telemetry, active sprint metrics, and pending approvals.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPresModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-extrabold border border-slate-700 transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
            title="Download Product Presentation (PPT)"
          >
            <IoDownloadOutline size={16} />
            <span>Product PPT</span>
          </button>
          <button
            onClick={() => navigate('/my-work')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <IoCheckmarkCircleOutline size={16} />
            <span>My Work Portal</span>
          </button>
          <button
            onClick={() => navigate('/ai-studio')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-extrabold border border-slate-700 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <IoSparklesOutline size={16} className="text-amber-400" />
            <span>AI Workspace</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Sprint</span>
            <IoFlashOutline size={20} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-black text-slate-900 truncate">{activeSprint ? activeSprint.name : 'No Active Sprint'}</h3>
          </div>
          <p className="text-[11px] font-semibold text-slate-500">
            {activeSprint ? `Goal: ${activeSprint.goal.slice(0, 30)}...` : 'Create a sprint in Sprint Planning'}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Projects</span>
            <IoFolderOpenOutline size={20} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900">{activeProjects.length}</h3>
            <span className="text-xs text-slate-500 font-semibold">of {projects.length} Total</span>
          </div>
          <p className="text-[11px] font-semibold text-emerald-600">All projects healthy and on schedule</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Revenue Portfolio</span>
            <IoCashOutline size={20} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900">${totalRevenue.toLocaleString()}</h3>
          </div>
          <p className="text-[11px] font-semibold text-slate-500">Budget Spent: <span className="font-bold text-slate-700">${totalSpent.toLocaleString()}</span></p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
            <IoShieldCheckmarkOutline size={20} className="text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900">{pendingApprovals.length}</h3>
            <span className="text-xs font-semibold text-amber-600">Requires Review</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500">Leave, Expense, Invoice approvals</p>
        </div>
      </div>

      {/* Main Grid: Today's Tasks & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Today's Tasks & Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IoCheckmarkCircleOutline className="text-emerald-600" size={20} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Today's Priority Tasks</h3>
              </div>
              <button onClick={() => navigate('/tasks?tab=board')} className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer">
                <span>View Task Board</span>
                <IoArrowForwardOutline size={14} />
              </button>
            </div>

            <div className="space-y-2">
              {todayTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No active tasks assigned for today.</p>
              ) : (
                todayTasks.map(t => (
                  <div key={t._id} className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between gap-3 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{t.taskId || 'SP'}</span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{t.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold">{t.projectName} • Priority: {t.priority}</p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                      t.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Projects Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IoFolderOpenOutline className="text-emerald-600" size={20} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Active Projects Overview</h3>
              </div>
              <button onClick={() => navigate('/projects')} className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer">
                <span>All Projects</span>
                <IoArrowForwardOutline size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeProjects.slice(0, 4).map(p => (
                <div key={p._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 truncate">{p.name}</h4>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">{p.health}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] font-bold text-slate-600">
                    <span>Budget: ${p.budget.toLocaleString()}</span>
                    <span>Team: {p.team.length} Members</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Approvals, AI Insights & Activity Feed */}
        <div className="space-y-6">
          {/* Pending Approvals Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IoShieldCheckmarkOutline className="text-purple-600" size={20} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Pending Approvals</h3>
              </div>
              <button onClick={() => navigate('/approvals')} className="text-xs font-bold text-purple-600 hover:underline cursor-pointer">View All</button>
            </div>

            <div className="space-y-2">
              {pendingApprovals.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No pending approval requests.</p>
              ) : (
                pendingApprovals.slice(0, 3).map(a => (
                  <div key={a._id} className="p-3 rounded-xl border border-purple-100 bg-purple-50/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-purple-700">{a.type}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{new Date(a.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">{a.title}</h5>
                    <p className="text-[10px] text-slate-600 font-medium">Requested by: <span className="font-bold">{a.requestedByName}</span></p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-2xl p-5 text-white space-y-3 shadow-lg border border-emerald-800/40">
            <div className="flex items-center gap-2 text-amber-400">
              <IoSparklesOutline size={18} />
              <h4 className="text-xs font-black uppercase tracking-wider">AI Business OS Insight</h4>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "Sprint 15 velocity is performing 18% higher than average. All 3 critical tasks in StackPilot SaaS are on track for early completion."
            </p>
            <button
              onClick={() => navigate('/ai-studio')}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-colors cursor-pointer text-center"
            >
              Ask AI Assistant
            </button>
          </div>

          {/* Organization Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Audit & Activity Log</h3>
              <button onClick={() => navigate('/audit-logs')} className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">Logs</button>
            </div>

            <div className="space-y-3">
              {activities.slice(0, 4).map(act => (
                <div key={act._id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-[11px]">{act.action}</p>
                    <p className="text-[10px] text-slate-500">{act.details || act.userName}</p>
                    <span className="text-[9px] text-slate-400">{new Date(act.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Presentation Download Modal */}
      <PresentationDownloadModal
        isOpen={isPresModalOpen}
        onClose={() => setIsPresModalOpen(false)}
        initialName={user?.name || ''}
        initialEmail={user?.email || ''}
        initialCompany={user?.department || ''}
      />
    </div>
  );
};

export default Dashboard;
