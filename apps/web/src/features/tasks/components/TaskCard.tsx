import React from 'react';
import type { Task, TaskPriority } from '../../../../../../packages/shared/types';
import { StoryPoints } from './StoryPoints';
import { IoTimeOutline, IoCheckmarkCircleOutline, IoChatboxEllipsesOutline, IoAttachOutline } from 'react-icons/io5';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
}

const priorityBadges: Record<TaskPriority, { bg: string; dot: string }> = {
  Low: { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
  Medium: { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  High: { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  Critical: { bg: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500 animate-pulse' },
};

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Recently';
  const time = new Date(dateStr).getTime();
  if (isNaN(time)) return 'Recently';

  const diffMs = Date.now() - time;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Updated just now';
  if (diffHours === 1) return 'Updated 1 hour ago';
  if (diffHours < 24) return `Updated ${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Updated yesterday';
  return `Updated ${diffDays} days ago`;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onDragStart }) => {
  const pBadge = priorityBadges[task.priority] || priorityBadges.Medium;

  const completedChecklist = task.checklist?.filter(c => c.done).length || 0;
  const totalChecklist = task.checklist?.length || 0;

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={e => onDragStart && onDragStart(e, task._id)}
      onClick={() => onClick(task)}
      className="group bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 cursor-pointer select-none relative overflow-hidden"
    >
      {/* Priority Color Bar Indicator */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${pBadge.dot}`} />

      {/* Header: Task ID & Project & Story Points */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-mono text-[11px] font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">
            {task.taskId || task._id.slice(0, 7).toUpperCase()}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[90px]">
            {task.projectName || 'Project'}
          </span>
        </div>

        <StoryPoints points={task.storyPoints || 1} size="sm" />
      </div>

      {/* Task Title */}
      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1.5 group-hover:text-emerald-700 transition-colors leading-relaxed">
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-snug font-normal">
          {task.description}
        </p>
      )}

      {/* Task Metadata Counters (Checklist, Comments, Attachments) */}
      {(totalChecklist > 0 || (task.comments && task.comments.length > 0) || (task.attachments && task.attachments.length > 0)) && (
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mb-3 pt-1 border-t border-slate-100">
          {totalChecklist > 0 && (
            <div className={`flex items-center gap-1 ${completedChecklist === totalChecklist ? 'text-emerald-600 font-bold' : ''}`}>
              <IoCheckmarkCircleOutline size={13} />
              <span>{completedChecklist}/{totalChecklist}</span>
            </div>
          )}
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center gap-1">
              <IoChatboxEllipsesOutline size={12} />
              <span>{task.comments.length}</span>
            </div>
          )}
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <IoAttachOutline size={13} />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>
      )}

      {/* Footer: Priority Badge & Assignee & Updated Time */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
        {/* Priority Badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${pBadge.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${pBadge.dot}`} />
          <span>{task.priority}</span>
        </span>

        {/* Assignee Avatar & Time */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 text-slate-400 font-medium">
            <IoTimeOutline size={12} />
            <span>{formatRelativeTime(task.updatedAt || task.createdAt)}</span>
          </div>

          <div className="relative" title={`Assignee: ${task.assigneeName || 'Unassigned'}`}>
            <img
              src={task.assigneeAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(task.assigneeName || 'User')}`}
              alt={task.assigneeName || 'User'}
              className="w-6 h-6 rounded-full border border-slate-200 object-cover bg-slate-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
