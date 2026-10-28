import React from 'react';
import type { Sprint, Task } from '../../../../../../packages/shared/types';
import { StoryPoints } from './StoryPoints';
import { 
  IoPlayOutline, 
  IoCheckmarkDoneOutline, 
  IoArchiveOutline, 
  IoCopyOutline, 
  IoPencilOutline, 
  IoTrashOutline,
  IoCalendarOutline,
  IoStatsChartOutline
} from 'react-icons/io5';

interface SprintCardProps {
  sprint: Sprint;
  tasks: Task[];
  userRole?: string;
  onStart: (sprint: Sprint) => void;
  onComplete: (sprint: Sprint) => void;
  onArchive: (sprint: Sprint) => void;
  onDuplicate: (sprint: Sprint) => void;
  onEdit: (sprint: Sprint) => void;
  onDelete: (sprint: Sprint) => void;
  onOpenReport?: (sprint: Sprint) => void;
}

const statusBadgeStyles: Record<string, string> = {
  Planning: 'bg-blue-50 text-blue-700 border-blue-200',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20',
  Completed: 'bg-slate-100 text-slate-700 border-slate-300',
  Archived: 'bg-zinc-100 text-zinc-500 border-zinc-300',
};

export const SprintCard: React.FC<SprintCardProps> = ({
  sprint,
  tasks,
  userRole,
  onStart,
  onComplete,
  onArchive,
  onDuplicate,
  onEdit,
  onDelete,
  onOpenReport,
}) => {
  const isManagerOrAdmin = userRole === 'Super Admin' || userRole === 'Admin' || userRole === 'Project Manager';

  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const totalTasks = tasks.length;

  const totalPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 1), 0);
  const completedPoints = tasks.filter(t => t.status === 'Done').reduce((sum, t) => sum + (t.storyPoints || 1), 0);

  const progressPercent = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  return (
    <div className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
      sprint.status === 'Active' ? 'border-emerald-300 ring-1 ring-emerald-500/10' : 'border-slate-200'
    }`}>
      {/* Top Title Bar & Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-black text-slate-900 tracking-tight">{sprint.name}</h3>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${statusBadgeStyles[sprint.status] || 'bg-slate-100'}`}>
              {sprint.status}
            </span>
          </div>
          {sprint.goal && (
            <p className="text-xs font-bold text-slate-700">
              <span className="text-slate-400 font-medium mr-1">Goal:</span>
              {sprint.goal}
            </p>
          )}
        </div>

        {/* Action Controls for PM / Super Admin */}
        <div className="flex items-center gap-1">
          {onOpenReport && (
            <button
              onClick={() => onOpenReport(sprint)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Sprint Analytics & Reports"
            >
              <IoStatsChartOutline size={16} />
            </button>
          )}
          {isManagerOrAdmin && (
            <>
              <button
                onClick={() => onDuplicate(sprint)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Duplicate Sprint"
              >
                <IoCopyOutline size={15} />
              </button>
              <button
                onClick={() => onEdit(sprint)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Edit Sprint"
              >
                <IoPencilOutline size={15} />
              </button>
              <button
                onClick={() => onDelete(sprint)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete Sprint"
              >
                <IoTrashOutline size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Description Snippet */}
      {sprint.description && (
        <p className="text-xs text-slate-500 mb-4 line-clamp-2">{sprint.description}</p>
      )}

      {/* Grid Specs (Dates, Capacity, Tasks, Story Points) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70 mb-4 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
          <div className="flex items-center gap-1 font-bold text-slate-700 mt-0.5">
            <IoCalendarOutline size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{sprint.startDate} - {sprint.endDate}</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Capacity</span>
          <div className="font-extrabold text-slate-800 mt-0.5">
            <StoryPoints points={totalPoints} capacity={sprint.capacity} showCapacity size="sm" />
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tasks</span>
          <span className="font-black text-slate-900 mt-0.5 block">{completedTasks} / {totalTasks} Tasks</span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Velocity</span>
          <span className="font-black text-emerald-600 mt-0.5 block">{sprint.velocity || completedPoints} pts/sprint</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="text-slate-600">Sprint Progress</span>
          <span className="text-emerald-600">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Lifecycle Action Buttons */}
      {isManagerOrAdmin && (
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          {sprint.status === 'Planning' && (
            <button
              onClick={() => onStart(sprint)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
            >
              <IoPlayOutline size={15} />
              <span>Start Sprint</span>
            </button>
          )}

          {sprint.status === 'Active' && (
            <button
              onClick={() => onComplete(sprint)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <IoCheckmarkDoneOutline size={15} />
              <span>Complete Sprint</span>
            </button>
          )}

          {sprint.status === 'Completed' && (
            <button
              onClick={() => onArchive(sprint)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <IoArchiveOutline size={15} />
              <span>Archive Sprint</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
