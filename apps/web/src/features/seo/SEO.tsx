import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, ProgressBar } from '../../components/UI';
import { useCustomization } from '../../context/CustomizationContext';
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
  IoSparklesOutline
} from 'react-icons/io5';
import API from '../../services/api';
import type { SEOReport } from '../../../../../packages/shared/types';

export const SEO: React.FC = () => {
  const { settings, formatCurrency, hasPermission } = useCustomization();
  const [activeTab, setActiveTab] = useState<'seo' | 'project' | 'testing' | 'revenue' | 'team'>('seo');
  const [report, setReport] = useState<SEOReport | null>(null);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-07-01');
  const [endDate, setEndDate] = useState<string>('2026-07-31');

  // Simulated metrics
  const projectMetrics = [
    { name: 'Telemetry Collector', status: 'Active', progress: 75, lead: 'Alex W.' },
    { name: 'SRS Automated Compiler', status: 'Planning', progress: 20, lead: 'Sarah J.' },
    { name: 'Checkout Integration', status: 'Completed', progress: 100, lead: 'Marcus A.' }
  ];

  const qaMetrics = [
    { id: 'TS-API-01', suite: 'Backend Core endpoints', passRate: 98.4, bugs: 2 },
    { id: 'TS-UI-02', suite: 'React Compiler components', passRate: 100, bugs: 0 },
    { id: 'TS-SEC-03', suite: 'Auth token encryption', passRate: 85.0, bugs: 4 }
  ];

  const financeMetrics = {
    totalRevenue: 2854000,
    outstandingInvoices: 450000,
    budgetSpent: 1250000,
    totalBudget: 1800000,
    marginProfit: 61.15
  };

  const employeeMetrics = [
    { name: 'Alexander Wright', tasks: 4, load: 70, status: 'Available' },
    { name: 'Sarah Jenkins', tasks: 6, load: 95, status: 'Busy' },
    { name: 'Marcus Aurelius', tasks: 3, load: 60, status: 'Available' },
    { name: 'Tony Soprano', tasks: 1, load: 30, status: 'On Leave' }
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

  const handleExportPDF = () => {
    const docContent = `STACKPILOT AI - OPERATIONAL INTELLIGENCE SUITE REPORT
Date Range: ${startDate} to ${endDate}
Generated: ${new Date().toLocaleString()}

==================================================
1. SEO & Search visibility Performance:
- Clicks (30d): ${report?.clicks.toLocaleString() || '14,850'}
- Impressions: ${report?.impressions.toLocaleString() || '492,000'}
- Rankings: #${report?.avgPosition || '11.8'}

2. Project Delivery Pipeline:
${projectMetrics.map(p => `- "${p.name}": Status: ${p.status} | Progress: ${p.progress}%`).join('\n')}

3. Quality Assurance (QA) pass metrics:
${qaMetrics.map(q => `- "${q.suite}": Pass Rate: ${q.passRate}% | Bugs: ${q.bugs}`).join('\n')}

4. Revenue & Financial Telemetry:
- Total Invoiced: ${formatCurrency(financeMetrics.totalRevenue)}
- Outstanding: ${formatCurrency(financeMetrics.outstandingInvoices)}
- Margins: ${financeMetrics.marginProfit}%

5. Workforce Resource Load:
${employeeMetrics.map(e => `- "${e.name}": Tasks: ${e.tasks} | Load: ${e.load}%`).join('\n')}

==================================================
End of Certified Operational Audit Report.
`;

    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `consolidated_operational_report.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleToggleChecklist = async (checkId: string, currentVal: boolean) => {
    if (!report) return;
    try {
      const updated = await API.seo.updateChecklist(report._id, checkId, !currentVal);
      setReport(updated);
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Reports Suite</h1>
          <p className="text-xs text-slate-400 mt-1">Unified analytics engine for SEO, project, finance, QA, and team performance.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search report metrics */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
            <IoSearchOutline className="text-slate-450" />
            <input 
              type="text" 
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-32 focus:w-44 transition-all"
            />
          </div>

          {/* Date range pickers */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-350">
            <IoCalendarOutline />
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-200 cursor-pointer"
            />
            <span className="text-slate-500">-</span>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-200 cursor-pointer"
            />
          </div>

          <Button 
            onClick={handleExportPDF}
            className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white"
          >
            <IoDownloadOutline size={15} /> Export PDF
          </Button>
          <Button 
            onClick={() => window.print()}
            variant="secondary"
            className="text-xs flex items-center gap-1.5 border border-[#22C55E] text-white hover:bg-slate-850"
          >
            <IoPrintOutline size={15} /> Print
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-px">
        {[
          { key: 'seo', label: 'SEO Visibility', icon: <IoGlobeOutline size={13} /> },
          { key: 'project', label: 'Project Delivery', icon: <IoBriefcaseOutline size={13} /> },
          { key: 'testing', label: 'QA & Testing', icon: <IoCheckmarkCircleOutline size={13} /> },
          { key: 'revenue', label: 'Revenue & margins', icon: <IoWalletOutline size={13} /> },
          { key: 'team', label: 'Team workloads', icon: <IoPeopleOutline size={13} /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-1.5 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-[#22C55E] text-[#22C55E]'
                : 'border-transparent text-slate-450 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Clicks (30d)</span>
              <h3 className="text-xl font-black text-white">{report?.clicks.toLocaleString() || '14,850'}</h3>
              <span className="text-[9px] text-emerald-450 font-bold mt-1 block">+8.4% vs last month</span>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Impressions</span>
              <h3 className="text-xl font-black text-white">{report?.impressions.toLocaleString() || '492,000'}</h3>
              <span className="text-[9px] text-emerald-400 font-bold mt-1 block">+12.2% vs last month</span>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Search position</span>
              <h3 className="text-xl font-black text-white">#{report?.avgPosition || '11.8'}</h3>
              <span className="text-[9px] text-emerald-400 font-bold mt-1 block">Advanced 1.2 ranks</span>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Optimization Score</span>
              <h3 className="text-xl font-black text-white">{report?.healthScore || '94'}/100</h3>
              <span className="text-[9px] text-[#22C55E] font-bold mt-1 block">GBP listing active</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Top Performing Keywords</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                      <th className="py-2 px-1">Keyword</th>
                      <th className="py-2 px-1">Volume</th>
                      <th className="py-2 px-1 text-right">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeywords.map((kw, idx) => (
                      <tr key={idx} className="border-b border-slate-850 hover:bg-slate-900/10 text-slate-350">
                        <td className="py-3 px-1 font-bold text-slate-200">{kw.keyword}</td>
                        <td className="py-3 px-1 font-mono">{kw.volume.toLocaleString()}</td>
                        <td className="py-3 px-1 text-right font-black text-[#22C55E]">#{kw.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <div className="border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">GBP Local Optimization</h3>
              </div>
              <div className="space-y-3">
                {report?.checklist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-950/20 border border-slate-850 rounded-xl">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={item.done}
                        onChange={() => handleToggleChecklist(item.id, item.done)}
                        className="w-4 h-4 rounded border-slate-800 text-[#22C55E] focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-xs ${item.done ? 'line-through text-slate-550' : 'text-slate-250 font-bold'}`}>{item.task}</span>
                    </div>
                    <Badge variant={item.done ? 'success' : 'secondary'}>{item.done ? 'Done' : 'Todo'}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 2. Project Tab */}
      {activeTab === 'project' && (
        <Card>
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Project Delivery Roster</h3>
          </div>
          <div className="space-y-4">
            {projectMetrics.map((p, idx) => (
              <div key={idx} className="p-4 border border-slate-850 bg-slate-950/20 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-white">{p.name}</h4>
                    <span className="text-[10px] text-slate-500">Lead Architect: {p.lead}</span>
                  </div>
                  <Badge variant={p.status === 'Completed' ? 'success' : p.status === 'Active' ? 'primary' : 'secondary'}>
                    {p.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-450">
                    <span>Delivery progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} color="bg-[#22C55E]" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3. Testing Tab */}
      {activeTab === 'testing' && (
        <Card>
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">QA Verification Runs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                  <th className="py-2.5 px-2">Suite ID</th>
                  <th className="py-2.5 px-2">Verification Suite</th>
                  <th className="py-2.5 px-2">Success Rate</th>
                  <th className="py-2.5 px-2 text-right">Outstanding Bugs</th>
                </tr>
              </thead>
              <tbody>
                {qaMetrics.map((qm, idx) => (
                  <tr key={idx} className="border-b border-slate-850 hover:bg-slate-900/10 text-slate-350">
                    <td className="py-3 px-2 font-mono font-bold text-slate-200">{qm.id}</td>
                    <td className="py-3 px-2 font-semibold">{qm.suite}</td>
                    <td className="py-3 px-2 font-mono text-[#22C55E]">{qm.passRate}%</td>
                    <td className="py-3 px-2 text-right font-black text-red-400">{qm.bugs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 4. Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card>
              <span className="text-[9px] font-bold text-slate-550 uppercase tracking-widest block">Total Billed</span>
              <h3 className="text-xl font-black text-white mt-1">{formatCurrency(financeMetrics.totalRevenue)}</h3>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-555 uppercase tracking-widest block">Pending Clearance</span>
              <h3 className="text-xl font-black text-amber-500 mt-1">{formatCurrency(financeMetrics.outstandingInvoices)}</h3>
            </Card>
            <Card>
              <span className="text-[9px] font-bold text-slate-555 uppercase tracking-widest block">Realized Profit Margin</span>
              <h3 className="text-xl font-black text-[#22C55E] mt-1">{financeMetrics.marginProfit}%</h3>
            </Card>
          </div>

          <Card className="space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 border-b border-slate-850 pb-2">Allocations burn chart</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Development Operations Labor</span>
                  <span className="font-bold text-white">{formatCurrency(720000)} (57.6%)</span>
                </div>
                <ProgressBar value={57.6} color="bg-emerald-500" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Strategy & Client Onboarding</span>
                  <span className="font-bold text-white">{formatCurrency(350000)} (28.0%)</span>
                </div>
                <ProgressBar value={28} color="bg-amber-500" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 5. Team Tab */}
      {activeTab === 'team' && (
        <Card>
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Employee Performance Load</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                  <th className="py-2.5 px-2">Member Name</th>
                  <th className="py-2.5 px-2">Active Tasks</th>
                  <th className="py-2.5 px-2">Availability</th>
                  <th className="py-2.5 px-2 text-right">Workload Capacity</th>
                </tr>
              </thead>
              <tbody>
                {employeeMetrics.map((emp, idx) => (
                  <tr key={idx} className="border-b border-slate-850 hover:bg-slate-900/10 text-slate-350">
                    <td className="py-3 px-2 font-bold text-slate-200">{emp.name}</td>
                    <td className="py-3 px-2 font-mono font-semibold">{emp.tasks} Tasks</td>
                    <td className="py-3 px-2">
                      <Badge variant={emp.status === 'Available' ? 'success' : emp.status === 'Busy' ? 'warning' : 'secondary'}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-mono">{emp.load}%</span>
                        <div className="w-16 bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div className={`h-full ${emp.load > 85 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${emp.load}%` }} />
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
    </div>
  );
};

export default SEO;
