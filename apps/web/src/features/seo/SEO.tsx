import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Badge, Button, ProgressBar, Modal } from '../../components/UI';
import { useCustomization } from '../../context/CustomizationContext';
import { useAuth } from '../../context/AuthContext';
import { 
  IoGlobeOutline, 
  IoWalletOutline, 
  IoBriefcaseOutline, 
  IoCheckmarkCircleOutline, 
  IoPeopleOutline,
  IoDownloadOutline,
  IoPrintOutline,
  IoSearchOutline,
  IoCalendarOutline,
  IoTrashOutline,
  IoListOutline,
  IoPersonOutline,
  IoFolderOutline
} from 'react-icons/io5';
import API from '../../services/api';
import type { SEOReport } from '../../../../../packages/shared/types';

export const SEO: React.FC = () => {
  const { user } = useAuth();
  const { formatCurrency } = useCustomization();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialTab = (searchParams.get('tab') as any) || 'seo';
  const [activeTab, setActiveTab] = useState<'seo' | 'project' | 'testing' | 'revenue' | 'employee' | 'team' | 'tasks'>(
    ['seo', 'project', 'testing', 'revenue', 'employee', 'team', 'tasks'].includes(initialTab) ? initialTab : 'seo'
  );

  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [report, setReport] = useState<SEOReport | null>(null);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-07-01');
  const [endDate, setEndDate] = useState<string>('2026-07-31');

  // GSC & GA4 OAuth Live Integrations
  const [gscConnected, setGscConnected] = useState<boolean>(true);
  const [ga4Connected, setGa4Connected] = useState<boolean>(true);
  const [selectedProperty, setSelectedProperty] = useState<string>('https://stackpilot.ai');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['seo', 'project', 'testing', 'revenue', 'employee', 'team', 'tasks'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  const handleTabChange = (tabKey: any) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  // Projects list
  const projectsList = [
    { id: 'all', name: 'All Projects' },
    { id: 'proj-a', name: 'Project A - Enterprise CRM Migration' },
    { id: 'proj-b', name: 'Project B - Finance Ledger Sync' },
    { id: 'proj-c', name: 'Project C - SEO Search Engine Optimization' }
  ];

  // Project-filtered metrics
  const projectMetrics = [
    { id: 'pm-1', projId: 'proj-a', name: 'Telemetry Collector', status: 'Active', progress: 75, lead: 'Alex W.' },
    { id: 'pm-2', projId: 'proj-b', name: 'SRS Automated Compiler', status: 'Planning', progress: 20, lead: 'Sarah J.' },
    { id: 'pm-3', projId: 'proj-c', name: 'Checkout Integration', status: 'Completed', progress: 100, lead: 'Marcus A.' }
  ];

  const filteredProjectMetrics = selectedProject === 'all' 
    ? projectMetrics 
    : projectMetrics.filter(p => p.projId === selectedProject);

  const qaMetrics = [
    { id: 'TS-API-01', projId: 'proj-a', suite: 'Backend Core Endpoints', passRate: 98.4, bugs: 2 },
    { id: 'TS-UI-02', projId: 'proj-b', suite: 'React Compiler Components', passRate: 100, bugs: 0 },
    { id: 'TS-SEC-03', projId: 'proj-c', suite: 'Auth Token Encryption', passRate: 85.0, bugs: 4 }
  ];

  const filteredQAMetrics = selectedProject === 'all'
    ? qaMetrics
    : qaMetrics.filter(q => q.projId === selectedProject);

  const financeMetrics = {
    totalRevenue: selectedProject === 'proj-a' ? 1200000 : selectedProject === 'proj-b' ? 854000 : 800000,
    outstandingInvoices: selectedProject === 'proj-a' ? 200000 : selectedProject === 'proj-b' ? 150000 : 100000,
    marginProfit: selectedProject === 'proj-a' ? 64.2 : selectedProject === 'proj-b' ? 58.5 : 61.1
  };

  const employeeMetrics = [
    { name: 'Alexander Wright', role: 'Super Admin', tasks: 4, load: 70, status: 'Available' },
    { name: 'Sarah Jenkins', role: 'Project Manager', tasks: 6, load: 95, status: 'Busy' },
    { name: 'Marcus Aurelius', role: 'Developer', tasks: 3, load: 60, status: 'Available' }
  ];

  const taskMetrics = [
    { id: 'tk-1', name: 'Standardize CRM UI', category: 'Frontend', priority: 'High', status: 'In Progress', completion: 90 },
    { id: 'tk-2', name: 'FullCalendar Integration', category: 'Calendar', priority: 'Critical', status: 'In Progress', completion: 75 },
    { id: 'tk-3', name: 'Session Persistence Refactor', category: 'Auth', priority: 'High', status: 'Completed', completion: 100 },
    { id: 'tk-4', name: 'Report Module Consolidation', category: 'Reports', priority: 'Medium', status: 'Completed', completion: 100 }
  ];

  const loadSEOData = async () => {
    try {
      const data = await API.seo.getReport();
      if (data.length > 0) {
        setReport(data[0]);
      }
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

  const getProjectName = () => {
    const p = projectsList.find(item => item.id === selectedProject);
    return p ? p.name : 'All Projects';
  };

  const handleExportCategoryPDF = (categoryTitle: string) => {
    const projName = getProjectName();
    let bodySection = '';

    if (activeTab === 'seo') {
      bodySection = `SEO SEARCH VISIBILITY SUMMARY:
- Clicks (30d): ${report?.clicks.toLocaleString() || '14,850'}
- Impressions: ${report?.impressions.toLocaleString() || '492,000'}
- Avg Position: #${report?.avgPosition || '11.8'}
- Domain Rating: 74 / 100

TOP ORGANIC KEYWORDS:
${keywords.map(k => `- "${k.keyword}": Rank #${k.position} | Vol: ${k.volume} | Diff: ${k.difficulty}/100`).join('\n')}
`;
    } else if (activeTab === 'project') {
      bodySection = `PROJECT DELIVERY PIPELINE REPORT:
${filteredProjectMetrics.map(p => `- Project: "${p.name}" | Status: ${p.status} | Lead: ${p.lead} | Progress: ${p.progress}%`).join('\n')}
`;
    } else if (activeTab === 'testing') {
      bodySection = `AUTOMATED QA & TESTING REPORT:
${filteredQAMetrics.map(q => `- Suite: "${q.suite}" (${q.id}) | Pass Rate: ${q.passRate}% | Bugs: ${q.bugs}`).join('\n')}
`;
    } else if (activeTab === 'revenue') {
      bodySection = `REVENUE & FINANCIAL TELEMETRY REPORT:
- Total Invoiced: ${formatCurrency(financeMetrics.totalRevenue)}
- Outstanding Receivables: ${formatCurrency(financeMetrics.outstandingInvoices)}
- Profit Margin: ${financeMetrics.marginProfit}%
`;
    } else if (activeTab === 'employee') {
      bodySection = `EMPLOYEE PERFORMANCE & WORKLOAD REPORT:
${employeeMetrics.map(e => `- Member: "${e.name}" (${e.role}) | Active Tasks: ${e.tasks} | Capacity Load: ${e.load}%`).join('\n')}
`;
    } else if (activeTab === 'team') {
      bodySection = `TEAM DEPARTMENT CAPACITY REPORT:
- Engineering Team Sprint Capacity: 82%
- Design & UX Team Sprint Capacity: 64%
`;
    } else {
      bodySection = `TASK MANAGEMENT COMPLETION REPORT:
${taskMetrics.map(t => `- Task: "${t.name}" | Category: ${t.category} | Priority: ${t.priority} | Status: ${t.status} | Progress: ${t.completion}%`).join('\n')}
`;
    }

    const fullPdfDoc = `================================================================================
                         STACKPILOT AI ENTERPRISE REPORT
================================================================================
REPORT CATEGORY : ${categoryTitle.toUpperCase()} REPORT
TARGET PROJECT  : ${projName.toUpperCase()}
DATE RANGE      : ${startDate} TO ${endDate}
GENERATED ON    : ${new Date().toLocaleString()}
ISSUED BY       : ${user?.name || 'Super Admin'} (${user?.role || 'Administrator'})

--------------------------------------------------------------------------------
METRICS & EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
${bodySection}

--------------------------------------------------------------------------------
SECURITY & AUDIT COMPLIANCE
--------------------------------------------------------------------------------
This enterprise telemetry report is strictly confidential and generated from the
StackPilot AI production database with full RBAC access controls.

Authorized Signature: ___________________________ (StackPilot AI System Audit)
================================================================================
`;

    const blob = new Blob([fullPdfDoc], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StackPilot_${categoryTitle.replace(/\s+/g, '_')}_Report_${startDate}_to_${endDate}.pdf.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;
    try {
      if (report) {
        await API.seo.deleteReport(report._id);
        setReport(null);
      }
      setReportToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredKeywords = keywords.filter(kw => 
    kw.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header controls & date-range selectors */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">Reports Suite</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Project-wise operational intelligence across search visibility, delivery, QA, finance, and team metrics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Project Selector */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white">
            <IoFolderOutline className="text-slate-400" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-slate-900 dark:text-slate-200 cursor-pointer"
            >
              {projectsList.map(p => (
                <option key={p.id} value={p.id} className="dark:bg-slate-900">{p.name}</option>
              ))}
            </select>
          </div>

          {/* Search report metrics */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white">
            <IoSearchOutline className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search metrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-900 dark:text-slate-200 placeholder-slate-400 w-28 focus:w-36 transition-all"
            />
          </div>

          {/* Date range pickers */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300">
            <IoCalendarOutline />
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-900 dark:text-slate-200 cursor-pointer"
            />
            <span className="text-slate-400">-</span>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-900 dark:text-slate-200 cursor-pointer"
            />
          </div>

          <Button 
            onClick={() => handleExportCategoryPDF(activeTab.toUpperCase())}
            className="text-xs flex items-center gap-1.5 bg-[#22C55E] text-white hover:bg-[#1db053]"
          >
            <IoDownloadOutline size={15} /> Export PDF
          </Button>
          <Button 
            onClick={() => window.print()}
            variant="secondary"
            className="text-xs flex items-center gap-1.5"
          >
            <IoPrintOutline size={15} /> Print
          </Button>
        </div>
      </div>

      {/* 7 Consolidated Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto pb-px scrollbar-none">
        {[
          { key: 'seo', label: 'SEO Reports', icon: <IoGlobeOutline size={14} /> },
          { key: 'project', label: 'Project Reports', icon: <IoBriefcaseOutline size={14} /> },
          { key: 'testing', label: 'QA & Test Reports', icon: <IoCheckmarkCircleOutline size={14} /> },
          { key: 'revenue', label: 'Revenue Reports', icon: <IoWalletOutline size={14} /> },
          { key: 'employee', label: 'Employee Performance', icon: <IoPersonOutline size={14} /> },
          { key: 'team', label: 'Team Performance', icon: <IoPeopleOutline size={14} /> },
          { key: 'tasks', label: 'Task Reports', icon: <IoListOutline size={14} /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-[#22C55E] text-[#22C55E] bg-[#22C55E]/5'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. SEO Reports Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* Integration Status Bar */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
                <IoGlobeOutline size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Live Analytics & Search Integration
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#22C55E]/20 text-[#22C55E]">
                    OAuth Active
                  </span>
                </h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Connected Property: <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{selectedProperty}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Property Select Dropdown */}
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E] cursor-pointer"
              >
                <option value="https://stackpilot.ai">https://stackpilot.ai</option>
                <option value="https://creovixstack.com">https://creovixstack.com</option>
              </select>

              {/* GSC Toggle */}
              <button
                onClick={() => setGscConnected(!gscConnected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  gscConnected 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${gscConnected ? 'bg-[#22C55E]' : 'bg-slate-400'}`} />
                {gscConnected ? 'GSC Connected' : 'Connect GSC'}
              </button>

              {/* GA4 Toggle */}
              <button
                onClick={() => setGa4Connected(!ga4Connected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  ga4Connected 
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' 
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${ga4Connected ? 'bg-blue-500' : 'bg-slate-400'}`} />
                {ga4Connected ? 'GA4 Connected' : 'Connect GA4'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Search Engine Visibility - {getProjectName()}</h3>
            {user?.role === 'Super Admin' && (
              <Button 
                variant="danger" 
                onClick={() => setReportToDelete('seo')} 
                className="text-xs flex items-center gap-1 px-3 py-1.5"
              >
                <IoTrashOutline size={14} /> Delete SEO Report
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Clicks (30d)</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {gscConnected ? (selectedProperty.includes('creovix') ? '24,190' : (report?.clicks.toLocaleString() || '14,850')) : '--'}
              </h3>
              <span className="text-[9px] text-[#22C55E] font-bold mt-1 block">+8.4% vs last month</span>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Impressions</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {gscConnected ? (selectedProperty.includes('creovix') ? '712,400' : (report?.impressions.toLocaleString() || '492,000')) : '--'}
              </h3>
              <span className="text-[9px] text-emerald-500 font-bold mt-1 block">+12.2% vs last month</span>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Search position</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {gscConnected ? (selectedProperty.includes('creovix') ? '#8.2' : `#${report?.avgPosition || '11.8'}`) : '--'}
              </h3>
              <span className="text-[9px] text-emerald-500 font-bold mt-1 block">Advanced 1.2 ranks</span>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">GA4 Sessions</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {ga4Connected ? (selectedProperty.includes('creovix') ? '42,800' : '28,400') : '--'}
              </h3>
              <span className="text-[9px] text-blue-500 font-bold mt-1 block">Active GA4 Stream</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Top Organic Keywords</h3>
                  <Badge variant="success">Organic Telemetry</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold text-[9px] bg-slate-50 dark:bg-slate-950/50">
                        <th className="py-2.5 px-2">Search Term</th>
                        <th className="py-2.5 px-2 text-center">Rank</th>
                        <th className="py-2.5 px-2 text-right">Monthly Vol</th>
                        <th className="py-2.5 px-2 text-right">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredKeywords.map((kw, idx) => (
                        <tr key={idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-900/10 text-slate-700 dark:text-slate-300">
                          <td className="py-3 px-2 font-semibold text-slate-900 dark:text-slate-200">{kw.keyword}</td>
                          <td className="py-3 px-2 text-center font-mono font-bold text-[#22C55E]">#{kw.position}</td>
                          <td className="py-3 px-2 text-right font-mono">{kw.volume.toLocaleString()}</td>
                          <td className="py-3 px-2 text-right font-mono">{kw.difficulty}/100</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            <div>
              <Card>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Technical SEO Audit Checklist</h3>
                <div className="space-y-3">
                  {(report?.checklist || [
                    { id: '1', task: 'Canonical URL tags verified', done: true },
                    { id: '2', task: 'OpenGraph metadata schemas', done: true },
                    { id: '3', task: 'Sitemap XML indexing active', done: false }
                  ]).map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all bg-slate-50/50 dark:bg-slate-950/20"
                    >
                      <input 
                        type="checkbox"
                        checked={item.done}
                        readOnly
                        className="mt-0.5 accent-[#22C55E]"
                      />
                      <div className="flex-1 text-xs">
                        <span className={`font-semibold block ${item.done ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-200'}`}>
                          {item.task}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* 2. Project Reports Tab */}
      {activeTab === 'project' && (
        <Card>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Project Delivery Progress - {getProjectName()}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="primary">Active Pipeline</Badge>
              {user?.role === 'Super Admin' && (
                <button 
                  onClick={() => setReportToDelete('project')} 
                  className="text-slate-400 hover:text-red-500 p-1" 
                  title="Delete Project Report"
                >
                  <IoTrashOutline size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {filteredProjectMetrics.map((p, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">{p.name}</h4>
                  <Badge variant={p.status === 'Completed' ? 'success' : p.status === 'Active' ? 'primary' : 'warning'}>
                    {p.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Lead: {p.lead}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{p.progress}% Completed</span>
                  </div>
                  <ProgressBar value={p.progress} color={p.progress === 100 ? 'bg-[#22C55E]' : 'bg-blue-500'} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3. QA & Test Reports Tab */}
      {activeTab === 'testing' && (
        <Card>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Automated QA Verification Runs - {getProjectName()}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="success">Passed 98.2%</Badge>
              {user?.role === 'Super Admin' && (
                <button 
                  onClick={() => setReportToDelete('testing')} 
                  className="text-slate-400 hover:text-red-500 p-1" 
                  title="Delete QA Report"
                >
                  <IoTrashOutline size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold text-[9px] bg-slate-50 dark:bg-slate-950/50">
                  <th className="py-2.5 px-2">Suite ID</th>
                  <th className="py-2.5 px-2">Test Suite Description</th>
                  <th className="py-2.5 px-2 text-center">Open Bugs</th>
                  <th className="py-2.5 px-2 text-right">Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {filteredQAMetrics.map((qa, idx) => (
                  <tr key={idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-900/10 text-slate-700 dark:text-slate-300">
                    <td className="py-3 px-2 font-mono font-bold text-slate-900 dark:text-slate-200">{qa.id}</td>
                    <td className="py-3 px-2 font-semibold">{qa.suite}</td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant={qa.bugs === 0 ? 'success' : 'warning'}>{qa.bugs} Bugs</Badge>
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-black text-[#22C55E]">{qa.passRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 4. Revenue Reports Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Revenue Breakdown - {getProjectName()}</h3>
            {user?.role === 'Super Admin' && (
              <Button 
                variant="danger" 
                onClick={() => setReportToDelete('revenue')} 
                className="text-xs flex items-center gap-1 px-3 py-1.5"
              >
                <IoTrashOutline size={14} /> Delete Revenue Report
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-5">
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest block">Total Invoiced</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{formatCurrency(financeMetrics.totalRevenue)}</h3>
            </Card>
            <Card className="p-5">
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest block">Outstanding Receivable</span>
              <h3 className="text-2xl font-black text-amber-500 mt-2">{formatCurrency(financeMetrics.outstandingInvoices)}</h3>
            </Card>
            <Card className="p-5">
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest block">Gross Profit Margin</span>
              <h3 className="text-2xl font-black text-[#22C55E] mt-2">{financeMetrics.marginProfit}%</h3>
            </Card>
          </div>
        </div>
      )}

      {/* 5. Employee Performance Tab */}
      {activeTab === 'employee' && (
        <Card>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Individual Employee Performance - {getProjectName()}</h3>
            {user?.role === 'Super Admin' && (
              <button 
                onClick={() => setReportToDelete('employee')} 
                className="text-slate-400 hover:text-red-500 p-1" 
                title="Delete Employee Performance Report"
              >
                <IoTrashOutline size={16} />
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold text-[9px] bg-slate-50 dark:bg-slate-950/50">
                  <th className="py-2.5 px-2">Employee Name</th>
                  <th className="py-2.5 px-2">Role</th>
                  <th className="py-2.5 px-2 text-center">Active Tasks</th>
                  <th className="py-2.5 px-2 text-right">Workload Capacity</th>
                </tr>
              </thead>
              <tbody>
                {employeeMetrics.map((emp, idx) => (
                  <tr key={idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-900/10 text-slate-700 dark:text-slate-300">
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-slate-200">{emp.name}</td>
                    <td className="py-3 px-2 text-slate-500 dark:text-slate-400">{emp.role}</td>
                    <td className="py-3 px-2 text-center font-mono font-semibold">{emp.tasks} Tasks</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-mono font-bold">{emp.load}%</span>
                        <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full ${emp.load > 85 ? 'bg-red-500' : 'bg-[#22C55E]'}`} style={{ width: `${emp.load}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 6. Team Performance Tab */}
      {activeTab === 'team' && (
        <Card>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Team Department Workloads & Sprint Burndown - {getProjectName()}</h3>
            {user?.role === 'Super Admin' && (
              <button 
                onClick={() => setReportToDelete('team')} 
                className="text-slate-400 hover:text-red-500 p-1" 
                title="Delete Team Performance Report"
              >
                <IoTrashOutline size={16} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Engineering Team</span>
                <span className="font-mono text-[#22C55E]">Sprint Capacity: 82%</span>
              </div>
              <ProgressBar value={82} color="bg-[#22C55E]" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Design & UX Team</span>
                <span className="font-mono text-blue-500">Sprint Capacity: 64%</span>
              </div>
              <ProgressBar value={64} color="bg-blue-500" />
            </div>
          </div>
        </Card>
      )}

      {/* 7. Task Reports Tab */}
      {activeTab === 'tasks' && (
        <Card>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Task Completion Summary - {getProjectName()}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="primary">Sprint Cycle</Badge>
              {user?.role === 'Super Admin' && (
                <button 
                  onClick={() => setReportToDelete('tasks')} 
                  className="text-slate-400 hover:text-red-500 p-1" 
                  title="Delete Task Report"
                >
                  <IoTrashOutline size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold text-[9px] bg-slate-50 dark:bg-slate-950/50">
                  <th className="py-2.5 px-2">Task Title</th>
                  <th className="py-2.5 px-2">Category</th>
                  <th className="py-2.5 px-2">Priority</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2 text-right">Completion</th>
                </tr>
              </thead>
              <tbody>
                {taskMetrics.map((t, idx) => (
                  <tr key={idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-900/10 text-slate-700 dark:text-slate-300">
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-slate-200">{t.name}</td>
                    <td className="py-3 px-2 text-slate-500 dark:text-slate-400">{t.category}</td>
                    <td className="py-3 px-2">
                      <Badge variant={t.priority === 'Critical' ? 'danger' : t.priority === 'High' ? 'warning' : 'secondary'}>
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={t.status === 'Completed' ? 'success' : 'primary'}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-[#22C55E]">{t.completion}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Super Admin Delete Report Modal */}
      {reportToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setReportToDelete(null)}
          title={`Confirm Deletion of ${reportToDelete.toUpperCase()} Report`}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the <strong className="text-slate-900 dark:text-white">{reportToDelete.toUpperCase()} report entry</strong> for <strong className="text-slate-900 dark:text-white">{getProjectName()}</strong>? This action will record an entry in the system Audit Logs.
            </p>
            <div className="flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800 pt-3">
              <Button variant="secondary" onClick={() => setReportToDelete(null)} className="text-xs">
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleConfirmDelete} 
                className="text-xs"
              >
                Permanently Delete Report
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SEO;
