import React from 'react';
import type { Task, Sprint, Project } from '../../../../../../packages/shared/types';
import { useSprints } from '../hooks/useSprints';
import { useTasks } from '../hooks/useTasks';
import { StoryPoints } from '../components/StoryPoints';
import { IoCalendarOutline, IoTimeOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

interface TimelineProps {
  projects: Project[];
}

export const Timeline: React.FC<TimelineProps> = ({ projects }) => {
  const { sprints, loading: sprintsLoading } = useSprints();
  const { tasks, loading: tasksLoading } = useTasks();

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Page Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Sprint & Task Roadmap Timeline</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Visual Gantt schedule across active and planned sprints
        </p>
      </div>

      {/* Main Timeline Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        {sprintsLoading || tasksLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs font-bold">Rendering Gantt Timeline...</span>
          </div>
        ) : sprints.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-bold">
            No sprints scheduled on the roadmap timeline.
          </div>
        ) : (
          <div className="space-y-6">
            {sprints.map(sprint => {
              const sprintTasks = tasks.filter(t => t.sprintId === sprint._id);
              const completedTasks = sprintTasks.filter(t => t.status === 'Done').length;
              const progressPct = sprintTasks.length > 0 ? Math.round((completedTasks / sprintTasks.length) * 100) : 0;

              return (
                <div key={sprint._id} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-black text-slate-900">{sprint.name}</h3>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
                        sprint.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}>
                        {sprint.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-1">
                        <IoCalendarOutline size={14} /> {sprint.startDate} to {sprint.endDate}
                      </span>
                      <span>Progress: <strong className="text-emerald-700">{progressPct}%</strong></span>
                    </div>
                  </div>

                  {/* Visual Timeline Bar */}
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* Associated Sprint Tasks Grid */}
                  <div className="pt-2 space-y-2">
                    {sprintTasks.map(t => (
                      <div key={t._id} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-400">{t.taskId || t._id.slice(0, 6)}</span>
                          <span className="font-bold text-slate-800">{t.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <StoryPoints points={t.storyPoints || 1} size="sm" />
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'Done' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
