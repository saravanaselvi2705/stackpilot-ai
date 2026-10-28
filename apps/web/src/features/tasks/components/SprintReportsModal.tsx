import React, { useState, useEffect } from 'react';
import type { Sprint, SprintReport } from '../../../../../../packages/shared/types';
import { sprintService } from '../services/sprintService';
import { 
  IoCloseOutline, 
  IoTrendingUpOutline, 
  IoSpeedometerOutline, 
  IoCheckmarkCircleOutline,
  IoWarningOutline,
  IoPersonOutline
} from 'react-icons/io5';

interface SprintReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprint: Sprint;
}

export const SprintReportsModal: React.FC<SprintReportsModalProps> = ({
  isOpen,
  onClose,
  sprint,
}) => {
  const [report, setReport] = useState<SprintReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'burndown' | 'burnup' | 'team'>('burndown');

  useEffect(() => {
    if (isOpen && sprint) {
      setLoading(true);
      sprintService.getSprintReport(sprint._id).then(r => {
        setReport(r);
        setLoading(false);
      });
    }
  }, [isOpen, sprint]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">{sprint.name} Reports & Analytics</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {sprint.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{sprint.projectName} • {sprint.startDate} to {sprint.endDate}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {loading || !report ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs font-bold">Generating Sprint Report Telemetry...</span>
          </div>
        ) : (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Points</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <IoCheckmarkCircleOutline className="text-emerald-500" size={18} />
                  <span className="text-lg font-black text-slate-900">{report.completedStoryPoints} / {report.totalStoryPoints} pts</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sprint Velocity</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <IoSpeedometerOutline className="text-blue-500" size={18} />
                  <span className="text-lg font-black text-slate-900">{report.velocity} pts/sprint</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tasks Done</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <IoTrendingUpOutline className="text-teal-500" size={18} />
                  <span className="text-lg font-black text-slate-900">{report.completedTasks} / {report.totalTasks}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blocked / Carryover</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <IoWarningOutline className="text-amber-500" size={18} />
                  <span className="text-lg font-black text-slate-900">{report.blockedTasks} / {report.carryForwardTasks}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs for Charts & Team */}
            <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('burndown')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'burndown' ? 'border-emerald-600 text-emerald-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Sprint Burndown Chart
              </button>
              <button
                onClick={() => setActiveTab('burnup')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'burnup' ? 'border-emerald-600 text-emerald-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Sprint Burnup Chart
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'team' ? 'border-emerald-600 text-emerald-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Team Contribution Breakdown
              </button>
            </div>

            {/* Burndown View */}
            {activeTab === 'burndown' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Burndown tracks remaining story points across the sprint timeframe versus ideal burn rate line.
                </p>
                <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>Timeline (Sprint Days)</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"/> Actual Remaining</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"/> Ideal Line</span>
                    </div>
                  </div>

                  {/* SVG Burndown Graph Visualization */}
                  <div className="h-44 w-full flex items-end justify-between gap-4 pt-4 pb-2 border-b border-slate-800">
                    {report.burndown.map((pt, idx) => {
                      const maxPts = report.totalStoryPoints || 1;
                      const actHeight = Math.round((pt.remainingPoints / maxPts) * 100);
                      const idealHeight = Math.round((pt.idealPoints / maxPts) * 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                          {/* Tooltip */}
                          <div className="absolute -top-8 bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {pt.remainingPoints} pts remaining
                          </div>

                          <div className="w-full flex items-end justify-center gap-1.5 h-full">
                            {/* Ideal Bar */}
                            <div
                              className="w-2.5 bg-slate-700/60 rounded-t transition-all"
                              style={{ height: `${idealHeight}%` }}
                            />
                            {/* Actual Bar */}
                            <div
                              className="w-4 bg-emerald-400 rounded-t transition-all shadow-lg shadow-emerald-500/20"
                              style={{ height: `${actHeight}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 mt-2">{pt.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Burnup View */}
            {activeTab === 'burnup' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Burnup visualizes completed story points cumulative growth toward total scope.
                </p>
                <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>Cumulative Points Completed</span>
                    <span className="text-emerald-400">Target: {report.totalStoryPoints} pts</span>
                  </div>

                  <div className="h-44 w-full flex items-end justify-between gap-4 pt-4 pb-2 border-b border-slate-800">
                    {report.burnup.map((pt, idx) => {
                      const maxPts = report.totalStoryPoints || 1;
                      const compHeight = Math.round((pt.completedPoints / maxPts) * 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                          <div className="absolute -top-8 bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {pt.completedPoints} pts done
                          </div>

                          <div
                            className="w-6 bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t transition-all shadow-lg shadow-teal-500/20"
                            style={{ height: `${compHeight}%` }}
                          />
                          <span className="text-[10px] font-bold text-slate-400 mt-2">{pt.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Team Performance View */}
            {activeTab === 'team' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Individual team member velocity and completed task contributions.
                </p>
                <div className="space-y-2">
                  {report.teamPerformance.map((member, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(member.name)}`}
                          alt={member.name}
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover bg-white"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                          <span className="text-[10px] text-slate-500 font-medium">Assigned: {member.assigned} tasks</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-bold">
                        <div className="text-right">
                          <span className="text-slate-400 text-[10px] block uppercase">Completed</span>
                          <span className="text-emerald-700">{member.completed} tasks</span>
                        </div>
                        <div className="text-right pl-4 border-l border-slate-200">
                          <span className="text-slate-400 text-[10px] block uppercase">Points</span>
                          <span className="text-blue-700">{member.points} pts</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-end bg-slate-50/50 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors cursor-pointer"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
