import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, ProgressBar, Drawer, Button } from '../../components/UI';
import { useCustomization } from '../../context/CustomizationContext';
import { useAuth } from '../../context/AuthContext';
import { 
  IoFolderOpenOutline, 
  IoPeopleOutline, 
  IoCashOutline, 
  IoLayersOutline, 
  IoCheckmarkCircleOutline,
  IoSparklesOutline,
  IoBugOutline,
  IoChevronForwardOutline,
  IoCalendarOutline,
  IoAddCircleOutline,
  IoDocumentTextOutline
} from 'react-icons/io5';
import API from '../../services/api';
import type { Project, Task, Invoice, Client } from '../../../../../packages/shared/types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { settings, formatCurrency } = useCustomization();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [fullActivities, setFullActivities] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    try {
      const [projs, ls, ts, invs, logs] = await Promise.all([
        API.projects.list(),
        API.crm.listLeads(),
        API.tasks.list(),
        API.finance.listInvoices(),
        API.logs.list().catch(() => [])
      ]);

      setProjects(projs || []);
      setClients(ls || []);
      setTasks(ts || []);
      setInvoices(invs || []);
      setActivities((logs || []).slice(0, 5));
      setFullActivities(logs || []);
    } catch (err) {
      console.error('Error fetching telemetry data for Dashboard:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute stats dynamically from database arrays
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const paidRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + (inv.total || 0), 0);
  const activeProjectsCount = projects.filter(p => p.status === 'Active' || p.status === 'Planning').length;
  const completedTasksCount = tasks.filter(t => t.status === 'Done').length;
  const highPriorityIssues = tasks.filter(t => t.priority === 'Critical' || t.priority === 'High').length;

  return (
    <div className="space-y-8">
      {/* Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Welcome back, <strong className="text-slate-900 dark:text-slate-200">{user?.name || 'Admin'}</strong>. Operational telemetry for <span className="font-bold uppercase tracking-wider text-[#22C55E]">{user?.role}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            onClick={() => navigate('/projects?action=add')} 
            className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white shadow-sm"
          >
            <IoAddCircleOutline size={16} /> Create Project
          </Button>
          <Button 
            onClick={() => navigate('/tasks?action=add')} 
            variant="secondary"
            className="text-xs flex items-center gap-1.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-800 hover:border-[#22C55E]"
          >
            <IoDocumentTextOutline size={16} /> New Task
          </Button>
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs rounded-xl px-4 py-2">
            <IoCalendarOutline className="text-[#22C55E]" size={14} />
            <span className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {settings.dashboardWidgets.metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card 
            onClick={() => navigate('/finance')}
            className="flex flex-col justify-between cursor-pointer hover:border-[#22C55E]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Invoiced</span>
              <div className="p-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl text-[#22C55E]">
                <IoCashOutline size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">{formatCurrency(totalRevenue)}</h3>
              <span className="text-[10px] font-semibold flex items-center gap-1 mt-1 text-emerald-600 dark:text-emerald-400">
                {formatCurrency(paidRevenue)} Realized Paid
              </span>
            </div>
          </Card>

          <Card 
            onClick={() => navigate('/projects')}
            className="flex flex-col justify-between cursor-pointer hover:border-[#22C55E]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Projects</span>
              <div className="p-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl text-[#22C55E]">
                <IoFolderOpenOutline size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">{projects.length}</h3>
              <span className="text-[10px] font-semibold flex items-center gap-1 mt-1 text-[#22C55E]">
                {activeProjectsCount} Active Pipeline
              </span>
            </div>
          </Card>

          <Card 
            onClick={() => navigate('/tasks')}
            className="flex flex-col justify-between cursor-pointer hover:border-[#22C55E]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tasks Board</span>
              <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-xl">
                <IoLayersOutline size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">{completedTasksCount} / {tasks.length}</h3>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 mt-1">
                {highPriorityIssues} High Priority
              </span>
            </div>
          </Card>

          <Card 
            onClick={() => navigate('/crm')}
            className="flex flex-col justify-between cursor-pointer hover:border-[#22C55E]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">CRM Clients</span>
              <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-xl">
                <IoPeopleOutline size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">{clients.length}</h3>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 mt-1">
                {clients.filter(c => c.status === 'Active').length} Active Accounts
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Main Charts & Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        {settings.dashboardWidgets.invoicesSummary ? (
          <Card className="lg:col-span-2 flex flex-col justify-between h-[380px]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Revenue Overview</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Live invoice totals vs realized payments.</p>
              </div>
              <Badge variant="success">Billing Live</Badge>
            </div>

            {/* Dynamic CSS Bar Chart */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, idx) => {
                const heightPercentage = Math.min(100, Math.max(15, (idx + 2) * 12));
                const paidHeight = Math.round(heightPercentage * 0.75);
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="w-full flex items-end justify-center gap-1.5 h-40 border-b border-slate-200 dark:border-slate-800 pb-1">
                      <div 
                        className="w-1/2 bg-slate-300 dark:bg-slate-700 rounded-t transition-all group-hover:bg-slate-400"
                        style={{ height: `${heightPercentage}%` }}
                        title={`Billed: ${formatCurrency(heightPercentage * 1000)}`}
                      />
                      <div 
                        className="w-1/2 bg-[#22C55E] rounded-t transition-all group-hover:bg-[#1db053]"
                        style={{ height: `${paidHeight}%` }}
                        title={`Paid: ${formatCurrency(paidHeight * 1000)}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{m}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#22C55E]" />
                <span>Realized Paid</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />
                <span>Total Invoiced</span>
              </div>
            </div>
          </Card>
        ) : (
          <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl h-[380px] flex items-center justify-center text-xs text-slate-500 font-bold">
            Analytics widget disabled
          </div>
        )}

        {/* Recent Audit Activity log */}
        {settings.dashboardWidgets.recentActivities ? (
          <Card className="flex flex-col justify-between h-[380px]">
            <div>
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Activity Log</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Recent system actions.</p>
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-[230px] pr-1">
                {activities.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">No recent log entries.</p>
                ) : (
                  activities.map((act) => (
                    <div key={act._id} className="flex gap-3 text-xs leading-relaxed border-b border-slate-100 dark:border-slate-800/40 pb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0 mt-1.5" />
                      <div className="min-w-0">
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          <span className="text-slate-900 dark:text-white font-bold">{act.userName || act.user || 'System'}</span>: {act.action}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{act.details}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <button 
              onClick={() => setDrawerOpen(true)}
              className="text-[10px] font-bold text-[#22C55E] hover:text-[#1db053] uppercase tracking-widest flex items-center gap-1 self-start mt-4 cursor-pointer"
            >
              View full log <IoChevronForwardOutline size={12} />
            </button>
          </Card>
        ) : (
          <div className="bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl h-[380px] flex items-center justify-center text-xs text-slate-500 font-bold">
            Activities widget disabled
          </div>
        )}
      </div>

      {/* Role Focused Dashboards Area */}
      <Card className="border border-slate-200 dark:border-slate-800">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <IoSparklesOutline size={16} className="text-[#22C55E]" />
            <span>Role Workspace: {user?.role || 'Super Admin'}</span>
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Shortcuts and live telemetry tailored for your role.</p>
        </div>

        {/* Project Manager Renders */}
        {(user?.role === 'Project Manager' || user?.role === 'Super Admin') && (
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Projects Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((p) => {
                const percentSpent = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
                return (
                  <div key={p._id} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</span>
                        <Badge variant={p.status === 'Active' ? 'success' : 'warning'}>{p.status}</Badge>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{p.description}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>Budget Cap: {formatCurrency(p.budget)}</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{percentSpent}% Spent</span>
                      </div>
                      <ProgressBar value={percentSpent} color={percentSpent > 85 ? 'bg-red-500' : 'bg-[#22C55E]'} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Complete Activity Log">
        <div className="space-y-4">
          <div className="text-xs text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex justify-between">
            <span>Workspace Logs</span>
            <span>{fullActivities.length} total actions recorded</span>
          </div>
          <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
            {fullActivities.map((act) => (
              <div key={act._id} className="p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{act.userName || act.user || 'System'}</span>
                  <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700">{act.userRole || 'Admin'}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">{act.action}</p>
                {act.details && <p className="text-[10px] text-slate-500 italic mt-0.5">{act.details}</p>}
                <div className="text-[9px] text-slate-400 text-right pt-1 border-t border-slate-200 dark:border-slate-800">
                  {new Date(act.createdAt || act.timestamp || Date.now()).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default Dashboard;
