import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCustomization } from '../../context/CustomizationContext';
import { Card, Badge, ProgressBar, Drawer } from '../../components/UI';
import { 
  IoFolderOpenOutline, 
  IoPeopleOutline, 
  IoCashOutline, 
  IoLayersOutline, 
  IoCheckmarkCircleOutline,
  IoSparklesOutline,
  IoBugOutline,
  IoChevronForwardOutline,
  IoCalendarOutline
} from 'react-icons/io5';
import API from '../../services/api';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { settings, formatCurrency } = useCustomization();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    revenue: 0,
    tasks: 0,
    issues: 0,
    tokens: '84,320'
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [fullActivities, setFullActivities] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ xPercent: string; yPx: number; month: string; value: number } | null>(null);
  const [projectsList, setProjectsList] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [projs, ls, ts, invs, logs] = await Promise.all([
          API.projects.list(),
          API.crm.listLeads(),
          API.tasks.list(),
          API.finance.listInvoices(),
          API.logs.list()
        ]);

        const paidRevenue = invs.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.total, 0);
        
        setStats({
          projects: projs.length,
          clients: ls.filter(l => l.status === 'Active').length,
          revenue: paidRevenue || 29500, // Fallback if no paid invoices
          tasks: ts.length,
          issues: ts.filter(t => t.priority === 'Critical').length,
          tokens: '84,320'
        });

        setProjectsList(projs);
        setActivities(logs.slice(0, 5));
        setFullActivities(logs);
      } catch (err) {
        console.error(err);
      }
    };
    loadDashboardData();
  }, []);

  // Custom Chart Data Coordinates
  const revenueChartData = [
    { month: 'Jan', revenue: 15 },
    { month: 'Feb', revenue: 22 },
    { month: 'Mar', revenue: 19 },
    { month: 'Apr', revenue: 35 },
    { month: 'May', revenue: 28 },
    { month: 'Jun', revenue: 45 }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Overview of your workspace and role: <span className="font-bold uppercase tracking-wider" style={{ color: settings.brandColor }}>{user?.role}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 self-start md:self-auto">
          <IoCalendarOutline style={{ color: settings.brandColor }} size={14} />
          <span className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue (Paid)</span>
              <div className="p-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl" style={{ color: settings.brandColor }}>
                <IoCashOutline size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black font-display text-white">{formatCurrency(stats.revenue)}</h3>
              <span className="text-[10px] font-semibold flex items-center gap-1 mt-1 text-emerald-400">
                +14.2% <span className="text-slate-500">vs last month</span>
              </span>
            </div>
          </Card>

          <Card 
            onClick={() => navigate('/projects')}
            className="flex flex-col justify-between cursor-pointer hover:border-[#22C55E]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projects</span>
              <div className="p-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl" style={{ color: settings.brandColor }}>
                <IoFolderOpenOutline size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black font-display text-white">{stats.projects}</h3>
              <span className="text-[10px] font-semibold flex items-center gap-1 mt-1 animate-pulse" style={{ color: settings.brandColor }}>
                {stats.projects > 1 ? 'Healthy Operations' : 'Planning phase'}
              </span>
            </div>
          </Card>

          <Card 
            onClick={() => navigate('/tasks')}
            className="flex flex-col justify-between cursor-pointer hover:border-[#22C55E]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasks</span>
              <div className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                <IoLayersOutline size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black font-display text-white">{stats.tasks}</h3>
              <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1 mt-1">
                {stats.issues} High Priority
              </span>
            </div>
          </Card>

          <Card 
            onClick={() => navigate('/ai-studio')}
            className="flex flex-col justify-between cursor-pointer hover:border-[#22C55E]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Usage</span>
              <div className="p-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
                <IoSparklesOutline size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black font-display text-white">{stats.tokens}</h3>
              <span className="text-[10px] text-purple-400 font-semibold flex items-center gap-1 mt-1">
                Tokens Seeded
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Main Charts & Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        {settings.dashboardWidgets.invoicesSummary ? (
          <Card className="lg:col-span-2 flex flex-col justify-between h-[360px]">
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Revenue</h3>
                <p className="text-[10px] text-slate-400">Total monthly invoices.</p>
              </div>
              <Badge variant="success">Stripe Live</Badge>
            </div>

            {/* SVG Custom Area Chart */}
            <div className="flex-1 w-full mt-6 relative flex items-end">
              <svg className="w-full h-full max-h-[180px]" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={settings.brandColor} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={settings.brandColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="37" x2="500" y2="37" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="5,5" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="5,5" />
                <line x1="0" y1="112" x2="500" y2="112" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="5,5" />

                {/* Area Fill */}
                <path
                  d="M 0 130 C 50 110, 100 120, 150 90 C 200 60, 250 80, 300 40 C 350 20, 400 30, 500 10 L 500 150 L 0 150 Z"
                  fill="url(#chartGlow)"
                />
                {/* Line path */}
                <path
                  d="M 0 130 C 50 110, 100 120, 150 90 C 200 60, 250 80, 300 40 C 350 20, 400 30, 500 10"
                  fill="none"
                  stroke={settings.brandColor}
                  strokeWidth="2.5"
                />

                {/* Hover nodes */}
                <circle cx="10" cy="130" r="5" style={{ fill: settings.brandColor }} className="stroke-slate-950 stroke-2 cursor-pointer hover:r-7 transition-all" onMouseEnter={() => setHoveredPoint({ xPercent: '2%', yPx: 80, month: 'January', value: 15000 })} onMouseLeave={() => setHoveredPoint(null)} />
                <circle cx="100" cy="115" r="5" style={{ fill: settings.brandColor }} className="stroke-slate-950 stroke-2 cursor-pointer hover:r-7 transition-all" onMouseEnter={() => setHoveredPoint({ xPercent: '20%', yPx: 65, month: 'February', value: 22000 })} onMouseLeave={() => setHoveredPoint(null)} />
                <circle cx="190" cy="80" r="5" style={{ fill: settings.brandColor }} className="stroke-slate-950 stroke-2 cursor-pointer hover:r-7 transition-all" onMouseEnter={() => setHoveredPoint({ xPercent: '38%', yPx: 30, month: 'March', value: 19000 })} onMouseLeave={() => setHoveredPoint(null)} />
                <circle cx="290" cy="50" r="5" style={{ fill: settings.brandColor }} className="stroke-slate-950 stroke-2 cursor-pointer hover:r-7 transition-all" onMouseEnter={() => setHoveredPoint({ xPercent: '58%', yPx: 10, month: 'April', value: 35000 })} onMouseLeave={() => setHoveredPoint(null)} />
                <circle cx="390" cy="25" r="5" style={{ fill: settings.brandColor }} className="stroke-slate-950 stroke-2 cursor-pointer hover:r-7 transition-all" onMouseEnter={() => setHoveredPoint({ xPercent: '78%', yPx: -10, month: 'May', value: 28000 })} onMouseLeave={() => setHoveredPoint(null)} />
                <circle cx="490" cy="10" r="5" style={{ fill: settings.brandColor }} className="stroke-slate-950 stroke-2 cursor-pointer hover:r-7 transition-all" onMouseEnter={() => setHoveredPoint({ xPercent: '88%', yPx: -20, month: 'June', value: 45000 })} onMouseLeave={() => setHoveredPoint(null)} />
              </svg>

              {hoveredPoint && (
                <div 
                  className="absolute z-10 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-[10px] text-slate-200 font-bold shadow-xl pointer-events-none -translate-x-1/2 transition-all duration-150"
                  style={{ left: hoveredPoint.xPercent, top: `${hoveredPoint.yPx}px`, borderColor: `${settings.brandColor}60` }}
                >
                  <div className="text-slate-500 font-normal uppercase text-[8px] tracking-wider">{hoveredPoint.month}</div>
                  <div className="text-white text-xs font-black mt-0.5">{formatCurrency(hoveredPoint.value)}</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold border-t border-slate-800/40 pt-4 mt-2">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
            </div>
          </Card>
        ) : (
          <div className="lg:col-span-2 bg-slate-900/10 border border-slate-800/40 rounded-3xl h-[360px] flex items-center justify-center text-xs text-slate-500 font-bold">
            Analytics widget disabled
          </div>
        )}

        {/* Recent Audit Activity log */}
        {settings.dashboardWidgets.recentActivities ? (
          <Card className="flex flex-col justify-between h-[360px]">
            <div>
              <div className="border-b border-slate-800/40 pb-4 mb-4">
                <h3 className="text-sm font-bold text-slate-200">Activity Log</h3>
                <p className="text-[10px] text-slate-400">Recent changes in your workspace.</p>
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-[220px] pr-1">
                {activities.map((act) => (
                  <div key={act._id} className="flex gap-3 text-xs leading-relaxed border-b border-slate-800/20 pb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0 mt-1.5" />
                  <div className="min-w-0">
                    <p className="text-slate-300 font-medium">
                      <span className="text-white font-bold">{act.userName}</span>: {act.action}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{act.details}</p>
                  </div>
                </div>
              ))}
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
        <div className="bg-slate-900/10 border border-slate-800/40 rounded-3xl h-[360px] flex items-center justify-center text-xs text-slate-500 font-bold">
          Activities widget disabled
        </div>
      )}
    </div>

      {/* Role Focused Dashboards Area */}
      <Card className="border border-[#22C55E]/10">
        <div className="border-b border-slate-800 pb-4 mb-6">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <IoSparklesOutline size={16} className="text-[#22C55E] animate-spin-slow" />
            <span>Role Dashboard: {user?.role}</span>
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">Tools and insights for your role.</p>
        </div>

        {/* Project Manager Renders */}
        {user?.role === 'Project Manager' && (
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-white mb-2">Projects List</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectsList.map((p) => (
                <div key={p._id} className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-200">{p.name}</span>
                      <Badge variant={p.status === 'Active' ? 'success' : 'warning'}>{p.status}</Badge>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mb-4">{p.description}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                      <span>Project Budget</span>
                      <span>{Math.round((p.spent / p.budget) * 100)}% Spent</span>
                    </div>
                    <ProgressBar value={(p.spent / p.budget) * 100} color="bg-[#22C55E]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Developer Renders */}
        {user?.role === 'Developer' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl flex items-center gap-4">
              <IoCheckmarkCircleOutline className="text-[#22C55E] shrink-0" size={24} />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Active Tasks</h4>
                <p className="text-[10px] text-slate-400">Implement turbopack webpack compatibility handlers. (Status: In Progress)</p>
              </div>
            </div>
            <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl flex items-center gap-4">
              <IoSparklesOutline className="text-purple-400 shrink-0" size={24} />
              <div>
                <h4 className="text-xs font-bold text-slate-200">AI Code Assistant</h4>
                <p className="text-[10px] text-slate-400">Use StackPilot AI to plan projects, create bug reports, or write code in AI Tools.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tester Renders */}
        {user?.role === 'Tester' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl flex items-center gap-4">
              <IoBugOutline className="text-red-400 shrink-0" size={24} />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Bug Reports</h4>
                <p className="text-[10px] text-slate-400">Create bug reports and test cases using AI.</p>
              </div>
            </div>
          </div>
        )}

        {/* Finance Renders */}
        {user?.role === 'Finance' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 mb-2">Revenue Details</h4>
            <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Tax Collected</span>
                <span className="text-sm font-bold text-slate-200">₹4,140</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Outstanding Invoices</span>
                <span className="text-sm font-bold text-yellow-500">₹26,140</span>
              </div>
              <Badge variant="success">Stripe Active</Badge>
            </div>
          </div>
        )}

        {/* Fallback info for other roles */}
        {!['Project Manager', 'Developer', 'Tester', 'Finance'].includes(user?.role || '') && (
          <p className="text-xs text-slate-400 italic">
            No actions needed for {user?.role}. Use the menu to manage clients, requirements, documents, and search rankings.
          </p>
        )}
      </Card>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Complete Activity Log">
        <div className="space-y-4">
          <div className="text-xs text-slate-400 border-b border-slate-800 pb-2 flex justify-between">
            <span>Workspace Logs</span>
            <span>{fullActivities.length} total actions recorded</span>
          </div>
          <div className="space-y-3.5">
            {fullActivities.map((act) => (
              <div key={act._id} className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white">{act.userName}</span>
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-950/40 px-2 py-0.5 rounded border border-slate-850">{act.userRole}</span>
                </div>
                <p className="text-slate-350">{act.action}</p>
                {act.details && <p className="text-[10px] text-slate-500 italic mt-0.5">{act.details}</p>}
                <div className="text-[9px] text-slate-500 text-right pt-1 border-t border-slate-900/10">
                  {new Date(act.createdAt).toLocaleString()}
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
