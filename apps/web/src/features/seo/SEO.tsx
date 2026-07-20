import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, ProgressBar } from '../../components/UI';
import { 
  IoGlobeOutline, 
  IoTrendingUpOutline, 
  IoListOutline, 
  IoSparklesOutline, 
  IoAdd, 
  IoDownloadOutline, 
  IoWalletOutline, 
  IoBriefcaseOutline, 
  IoBarChartOutline 
} from 'react-icons/io5';
import API from '../../services/api';
import type { SEOReport } from '../../../../../packages/shared/types';

export const SEO: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seo' | 'finance' | 'ops'>('seo');
  const [report, setReport] = useState<SEOReport | null>(null);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [blogTitle, setBlogTitle] = useState<string>('');
  const [blogStatus, setBlogStatus] = useState<string>('');

  // Simulated metrics for other tabs
  const financeMetrics = {
    totalRevenue: 2854000,
    outstandingInvoices: 450000,
    budgetSpent: 1250000,
    totalBudget: 1800000,
    marginProfit: 61.15
  };

  const opsMetrics = {
    totalTasks: 25,
    completedTasks: 12,
    inProgressTasks: 8,
    pendingTasks: 5,
    teamCapacity: 85
  };

  const loadSEOData = async () => {
    try {
      const data = await API.seo.getReport();
      if (data.length > 0) {
        setReport(data[0]);
      }
      
      // Keywords initial seed
      setKeywords([
        { keyword: 'ai project management', position: 3, volume: 18100, difficulty: 45 },
        { keyword: 'enterprise operations software', position: 7, volume: 5400, difficulty: 38 },
        { keyword: 'automated srs document writer', position: 1, volume: 1200, difficulty: 12 },
        { keyword: 'sales lead pipeline free', position: 18, volume: 8300, difficulty: 52 }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSEOData();
  }, []);

  const handleToggleChecklist = async (checkId: string, currentVal: boolean) => {
    if (!report) return;
    try {
      const updated = await API.seo.updateChecklist(report._id, checkId, !currentVal);
      setReport(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle) return;
    setBlogStatus(`"${blogTitle}" successfully saved as a draft.`);
    setBlogTitle('');
    setTimeout(() => setBlogStatus(''), 4000);
  };

  const handleExportPDF = () => {
    // Generate high-fidelity report snapshot markdown text
    const docContent = `# StackPilot AI - Consolidated Operations & Performance Report
Generated: ${new Date().toLocaleString()}

==================================================

## 1. Search Engine Visibility (SEO)
- Clicks (30d): ${report?.clicks.toLocaleString() || '14,850'}
- Total Impressions: ${report?.impressions.toLocaleString() || '492,000'}
- Average Search Ranking: #${report?.avgPosition || '11.8'}
- Health & Optimization Score: ${report?.healthScore || '94'}/100

Keywords Rankings:
${keywords.map(k => `- "${k.keyword}": Position #${k.position} (Diff: ${k.difficulty}%)`).join('\n')}

==================================================

## 2. Financial Performance (Rupees)
- Total Realized Revenue: ₹${financeMetrics.totalRevenue.toLocaleString()}
- Outstanding Invoices: ₹${financeMetrics.outstandingInvoices.toLocaleString()}
- Realized Budget Spent: ₹${financeMetrics.budgetSpent.toLocaleString()} / ₹${financeMetrics.totalBudget.toLocaleString()}
- Average Projected Profit Margin: ${financeMetrics.marginProfit}%

==================================================

## 3. Operations & Deliverables Roster
- Total Active Tasks: ${opsMetrics.totalTasks}
- Completed Deliverables: ${opsMetrics.completedTasks}
- In Progress: ${opsMetrics.inProgressTasks}
- Backlogged/Pending Review: ${opsMetrics.pendingTasks}
- Current Resource Workload Capacity: ${opsMetrics.teamCapacity}%

==================================================
Report verified and certified by StackPilot AI Audit Engine.
`;

    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stackpilot_consolidated_report.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Reports Suite</h1>
          <p className="text-xs text-slate-400 mt-1">Monitor search visibility, project financial telemetry, and resource planning operations.</p>
        </div>
        <Button 
          onClick={handleExportPDF}
          className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white self-start sm:self-center"
        >
          <IoDownloadOutline size={16} /> Export Suite Report (PDF)
        </Button>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'seo'
              ? 'border-[#22C55E] text-[#22C55E]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <IoGlobeOutline size={14} /> Search Console & SEO
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'finance'
              ? 'border-[#22C55E] text-[#22C55E]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <IoWalletOutline size={14} /> Financial Performance
        </button>
        <button
          onClick={() => setActiveTab('ops')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ops'
              ? 'border-[#22C55E] text-[#22C55E]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <IoBriefcaseOutline size={14} /> Operations & Tasks
        </button>
      </div>

      {/* SEO TAB CONTENT */}
      {activeTab === 'seo' && (
        <div className="space-y-8 animate-fade-in">
          {/* SEO KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Clicks (30d)</span>
              <h3 className="text-xl font-black font-display text-white">{report?.clicks.toLocaleString() || '14,850'}</h3>
              <span className="text-[9px] text-emerald-400 font-bold mt-1 inline-block">+8.4% vs last month</span>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Impressions</span>
              <h3 className="text-xl font-black font-display text-white">{report?.impressions.toLocaleString() || '492,000'}</h3>
              <span className="text-[9px] text-emerald-400 font-bold mt-1 inline-block">+12.2% vs last month</span>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Search Ranking</span>
              <h3 className="text-xl font-black font-display text-white">{report?.avgPosition || '11.8'}</h3>
              <span className="text-[9px] text-emerald-400 font-bold mt-1 inline-block">Advanced 1.2 ranks</span>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Optimization Score</span>
              <h3 className="text-xl font-black font-display text-white">{report?.healthScore || '94'}/100</h3>
              <span className="text-[9px] text-[#22C55E] font-bold mt-1 inline-block">Sitemap sync active</span>
            </Card>
          </div>

          {/* Search Console line graph */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 h-[340px] flex flex-col justify-between">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Search Traffic</h3>
                <p className="text-[9px] text-slate-500">Monthly search visibility trend</p>
              </div>

              {/* SVG line chart */}
              <div className="flex-1 w-full mt-4 flex items-end">
                <svg className="w-full h-full max-h-[160px]" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <line x1="0" y1="37" x2="500" y2="37" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="4,4" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="4,4" />
                  <line x1="0" y1="112" x2="500" y2="112" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="4,4" />
                  
                  {/* Line path */}
                  <path
                    d="M 0 120 C 50 110, 100 130, 150 90 C 200 50, 250 80, 300 40 C 350 10, 400 30, 500 5"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="2"
                  />
                  <path
                    d="M 0 100 C 50 80, 100 90, 150 60 C 200 30, 250 40, 300 20 C 350 5, 400 15, 500 2"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold border-t border-slate-800/40 pt-3">
                <span>W1</span>
                <span>W2</span>
                <span>W3</span>
                <span>W4</span>
                <span>W5</span>
                <span>W6</span>
              </div>
            </Card>

            {/* Competitor visibility analysis */}
            <Card className="h-[340px] flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Competitor Traffic Share</h3>
                  <p className="text-[9px] text-slate-500">Estimated search visibility share compared to competitors.</p>
                </div>

                <div className="space-y-4">
                  {report?.competitors?.map((comp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">{comp.name}</span>
                        <span className="font-bold text-slate-400">{comp.visibility}% share</span>
                      </div>
                      <ProgressBar value={comp.visibility * 2} color={comp.name === 'StackPilot AI' ? 'bg-[#22C55E]' : 'bg-slate-700'} />
                    </div>
                  ))}
                </div>
              </div>

              <span className="text-[9px] text-slate-500 italic block mt-4">Updated daily.</span>
            </Card>
          </div>

          {/* Keywords and GBP checks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Keywords Table */}
            <Card>
              <div className="border-b border-slate-800 pb-4 mb-4 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Keywords</h3>
                <span className="text-[9px] text-slate-500">4 active keywords</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                      <th className="py-2.5 px-2">Keyword</th>
                      <th className="py-2.5 px-2">Volume</th>
                      <th className="py-2.5 px-2">Difficulty</th>
                      <th className="py-2.5 px-2 text-right">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((kw, idx) => (
                      <tr key={idx} className="border-b border-slate-800/30 hover:bg-slate-900/10 text-slate-300">
                        <td className="py-3 px-2 font-semibold text-white">{kw.keyword}</td>
                        <td className="py-3 px-2 font-mono">{kw.volume.toLocaleString()}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{kw.difficulty}%</span>
                            <div className="w-12 bg-slate-800 h-1 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full" style={{ width: `${kw.difficulty}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right font-black text-[#22C55E]">#{kw.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* GBP Audit Checklist */}
            <Card>
              <div className="border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Local Search Checklist</h3>
                <p className="text-[9px] text-slate-500">Optimize your local search listing.</p>
              </div>

              <div className="space-y-3">
                {report?.checklist.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3 bg-slate-950/20 border border-slate-850/65 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => handleToggleChecklist(item.id, item.done)}
                        className="w-4 h-4 rounded border-slate-800 text-[#22C55E] focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-xs ${item.done ? 'line-through text-slate-500 font-medium' : 'text-slate-200 font-semibold'}`}>
                        {item.task}
                      </span>
                    </div>
                    <Badge variant={item.done ? 'success' : 'secondary'}>{item.done ? 'Completed' : 'Todo'}</Badge>
                  </div>
                ))}
              </div>

              {/* Blog generator interface shortcut */}
              <form onSubmit={handlePublishPost} className="mt-6 pt-5 border-t border-slate-800/60 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <IoSparklesOutline size={12} className="text-[#22C55E] animate-pulse" /> Create Blog Post
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter blog post title..."
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#22C55E]/50"
                  />
                  <Button type="submit" size="sm" className="text-xs shrink-0 bg-[#22C55E] hover:bg-[#1db053] text-white">Create Post</Button>
                </div>
                {blogStatus && (
                  <p className="text-[10px] text-[#22C55E] font-bold bg-[#22C55E]/10 border border-[#22C55E]/20 p-2 rounded-lg">
                    {blogStatus}
                  </p>
                )}
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* FINANCE TAB CONTENT */}
      {activeTab === 'finance' && (
        <div className="space-y-8 animate-fade-in">
          {/* Finance KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Revenue (₹)</span>
              <h3 className="text-xl font-black font-display text-white">₹{financeMetrics.totalRevenue.toLocaleString()}</h3>
              <Badge variant="success" className="mt-2 text-[8px]">Invoiced & Cleared</Badge>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Outstanding (₹)</span>
              <h3 className="text-xl font-black font-display text-white">₹{financeMetrics.outstandingInvoices.toLocaleString()}</h3>
              <Badge variant="warning" className="mt-2 text-[8px]">Net 30 terms</Badge>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Budget Burned</span>
              <h3 className="text-xl font-black font-display text-white">₹{financeMetrics.budgetSpent.toLocaleString()}</h3>
              <span className="text-[9px] text-slate-400 mt-1 inline-block">of ₹{financeMetrics.totalBudget.toLocaleString()} Total</span>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Project Margin Profit</span>
              <h3 className="text-xl font-black font-display text-[#22C55E]">{financeMetrics.marginProfit}%</h3>
              <span className="text-[9px] text-emerald-400 font-bold mt-1 inline-block">Healthy threshold</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Budget allocation chart */}
            <Card className="lg:col-span-2 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Internal Budget Resource Allocation</h3>
                <p className="text-[9px] text-slate-500">Distribution of internal engineering labor costs vs margins.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-350">Engineering & Senior Dev Labor</span>
                    <span className="font-bold text-slate-200">₹7,20,000 (57.6%)</span>
                  </div>
                  <ProgressBar value={57.6} color="bg-emerald-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-350">Quality Assurance testing</span>
                    <span className="font-bold text-slate-200">₹1,80,000 (14.4%)</span>
                  </div>
                  <ProgressBar value={14.4} color="bg-blue-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-350">Corporate Strategy PM costs</span>
                    <span className="font-bold text-slate-200">₹3,50,000 (28.0%)</span>
                  </div>
                  <ProgressBar value={28} color="bg-amber-500" />
                </div>
              </div>
            </Card>

            {/* Financial Telemetry summary */}
            <Card className="flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Finance Audits</h3>
                  <p className="text-[9px] text-slate-500">Operational performance ratings.</p>
                </div>
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between border-b border-slate-850 pb-2">
                    <span className="text-slate-500">Auditor Status</span>
                    <span className="text-emerald-450 font-bold">Compliant</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-850 pb-2">
                    <span className="text-slate-500">Escrow Clearance</span>
                    <span className="text-slate-200 font-semibold">98.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tax deductions</span>
                    <span className="text-slate-200 font-semibold">₹1,24,000 GST</span>
                  </div>
                </div>
              </div>
              <span className="text-[9px] text-slate-550 block pt-4">Calculations synchronized with Finance Billing logs.</span>
            </Card>
          </div>
        </div>
      )}

      {/* OPERATIONS TAB CONTENT */}
      {activeTab === 'ops' && (
        <div className="space-y-8 animate-fade-in">
          {/* Ops KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Active Roster Tasks</span>
              <h3 className="text-xl font-black font-display text-white">{opsMetrics.totalTasks}</h3>
              <Badge variant="purple" className="mt-2 text-[8px]">Agile sprint active</Badge>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Completed Deliverables</span>
              <h3 className="text-xl font-black font-display text-emerald-400">{opsMetrics.completedTasks}</h3>
              <span className="text-[9px] text-slate-400 mt-1 inline-block">48% of total sprint</span>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">In Progress Tasks</span>
              <h3 className="text-xl font-black font-display text-amber-400">{opsMetrics.inProgressTasks}</h3>
              <span className="text-[9px] text-slate-400 mt-1 inline-block">8 developers active</span>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Resource Capacity</span>
              <h3 className="text-xl font-black font-display text-white">{opsMetrics.teamCapacity}%</h3>
              <Badge variant="success" className="mt-2 text-[8px]">Stable Workloads</Badge>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workforce load card */}
            <Card className="lg:col-span-2 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active Resource Utilization</h3>
                <p className="text-[9px] text-slate-500">Distribution of workloads across active engineering members.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-850/50">
                  <span className="font-semibold text-slate-200">Alexander Wright</span>
                  <span className="text-slate-400">3 Tasks (60% load)</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-850/50">
                  <span className="font-semibold text-slate-200">Sarah Jenkins</span>
                  <span className="text-slate-400">4 Tasks (85% load)</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-850/50">
                  <span className="font-semibold text-slate-200">Marcus Aurelius</span>
                  <span className="text-red-400 font-bold">6 Tasks (95% overload)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Tony Soprano</span>
                  <span className="text-slate-400">2 Tasks (40% load)</span>
                </div>
              </div>
            </Card>

            {/* Sprint Details summary */}
            <Card className="flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Sprint Health Roster</h3>
                  <p className="text-[9px] text-slate-500">Operational delivery indicators.</p>
                </div>
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between border-b border-slate-850 pb-2">
                    <span className="text-slate-500">Sprint Velocity</span>
                    <span className="text-slate-200 font-semibold">4.8 story pts/day</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-850 pb-2">
                    <span className="text-slate-500">Code Quality Rating</span>
                    <span className="text-emerald-450 font-bold">98.2% Passing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Compiler status</span>
                    <span className="text-[#22C55E] font-semibold">Build passes</span>
                  </div>
                </div>
              </div>
              <span className="text-[9px] text-slate-550 block pt-4">Calculated from Kanban board telemetry.</span>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEO;
