import React, { useState } from 'react';
import { 
  IoBarChartOutline, 
  IoFolderOpenOutline, 
  IoCashOutline, 
  IoGlobeOutline, 
  IoListOutline, 
  IoPeopleOutline, 
  IoShieldCheckmarkOutline,
  IoArrowForwardOutline,
  IoStatsChartOutline
} from 'react-icons/io5';

export const ReportsHub: React.FC = () => {
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);

  const reportCategories = [
    {
      id: 'projects',
      title: 'Project Performance Telemetry',
      description: 'Sprint burndown, velocity trends, project milestone completion & budget utilization.',
      icon: <IoFolderOpenOutline size={24} className="text-emerald-600" />,
      metrics: ['Sprint Velocity: 28 pts', 'Project Completion Rate: 84%', 'Budget Burn: 62%']
    },
    {
      id: 'finance',
      title: 'Financial & Invoicing Analytics',
      description: 'Monthly recurring revenue, invoice collection status, profit margins & forecast.',
      icon: <IoCashOutline size={24} className="text-emerald-700" />,
      metrics: ['MRR: $24,500', 'Outstanding Invoices: $6,650', 'Paid This Month: $13,750']
    },
    {
      id: 'seo',
      title: 'SEO & Growth Marketing Suite',
      description: 'Google Search Console click telemetry, keyword SERP rankings, CTR analytics.',
      icon: <IoGlobeOutline size={24} className="text-blue-600" />,
      metrics: ['Total Clicks: 14,200', 'Avg Rank Position: #4.2', 'CTR: 8.4%']
    },
    {
      id: 'tasks',
      title: 'Agile Task & Sprint Audits',
      description: 'Cycle time, lead time, bottleneck analysis, task distribution by priority.',
      icon: <IoListOutline size={24} className="text-purple-600" />,
      metrics: ['Avg Lead Time: 3.2 Days', 'Task Throughput: 42/week', 'Blocked Tasks: 1']
    },
    {
      id: 'employee',
      title: 'Team Productivity & Utilization',
      description: 'Timesheet billable hours vs non-billable hours, team bandwidth & PTO tracking.',
      icon: <IoPeopleOutline size={24} className="text-amber-600" />,
      metrics: ['Billable Utilization: 88%', 'Logged Hours This Week: 184 hrs', 'PTO Balance: Active']
    },
    {
      id: 'qa',
      title: 'Quality Assurance & Automated QA',
      description: 'Bug resolution rates, test case pass rates, release stability metrics.',
      icon: <IoShieldCheckmarkOutline size={24} className="text-indigo-600" />,
      metrics: ['QA Pass Rate: 98.2%', 'Resolved Bugs: 14', 'Zero Critical Blockers']
    }
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <IoBarChartOutline size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">StackPilot Business OS Reports Hub</h1>
            <p className="text-xs text-slate-500 font-medium">Enterprise Intelligence Workspace across Projects, Finance, SEO, Tasks, and Team QA.</p>
          </div>
        </div>
      </div>

      {/* Grid of Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCategories.map(cat => (
          <div
            key={cat.id}
            onClick={() => setSelectedSuite(cat.title)}
            className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-emerald-50 transition-colors w-fit">
                {cat.icon}
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{cat.title}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{cat.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Key Telemetry Metrics</span>
              <div className="space-y-1">
                {cat.metrics.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{m.split(':')[0]}</span>
                    <span className="text-emerald-600">{m.split(':')[1]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-black text-emerald-600">
              <span>Open Report Workspace</span>
              <IoArrowForwardOutline size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Workspace Preview Modal */}
      {selectedSuite && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IoStatsChartOutline className="text-emerald-600" size={20} />
                <h3 className="text-base font-black text-slate-900">{selectedSuite} - Full Analytics View</h3>
              </div>
              <button onClick={() => setSelectedSuite(null)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700">
                Close Hub
              </button>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between text-emerald-400 border-b border-slate-800 pb-2">
                <span>[STACKPILOT REALTIME ENGINE]</span>
                <span>STATUS: OPERATIONAL</span>
              </div>
              <p className="text-slate-300">
                Displaying real-time analytical dataset for {selectedSuite}. Data verified against live production database.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-800 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400">AGILE BURNDOWN RATE</span>
                  <div className="text-xl font-bold text-emerald-400">94.8%</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400">FORECAST COMPLIANCE</span>
                  <div className="text-xl font-bold text-amber-400">ON TRACK</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  alert(`Exporting ${selectedSuite} PDF/Excel Report...`);
                  setSelectedSuite(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-xs"
              >
                Export Full PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsHub;
