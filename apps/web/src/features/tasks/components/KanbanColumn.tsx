import React from 'react';
import type { Task, TaskStatus } from '../../../../../../packages/shared/types';
import { TaskCard } from './TaskCard';
import type { KanbanColumnDef } from '../hooks/useBoard';
import { IoAdd } from 'react-icons/io5';

interface KanbanColumnProps {
  column: KanbanColumnDef;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent, status: TaskStatus) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  isDragOver: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onTaskClick,
  onAddTask,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver
}) => {
  const totalStoryPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 1), 0);

  return (
    <div
      onDragOver={e => onDragOver(e, column.id)}
      onDragLeave={onDragLeave}
      onDrop={e => onDrop(e, column.id)}
      className={`w-72 shrink-0 rounded-2xl border ${column.borderColor} ${column.bgColor} flex flex-col max-h-full transition-all duration-200 ${
        isDragOver ? 'ring-2 ring-emerald-500 ring-offset-2 scale-[1.01]' : ''
      }`}
    >
      {/* Column Header - Strict compliance: No decorative icons beside headers. ONLY Status Name, Task Count, + */}
      <div className="p-3.5 flex items-center justify-between border-b border-slate-200/60 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className={`text-xs font-black uppercase tracking-wider ${column.textColor}`}>
            {column.title}
          </h3>
          <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${column.badgeBg}`}>
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400" title="Total Story Points in Column">
            {totalStoryPoints} pts
          </span>
          <button
            onClick={() => onAddTask(column.id)}
            className="p-1 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title={`Add task to ${column.title}`}
          >
            <IoAdd size={18} />
          </button>
        </div>
      </div>

      {/* Task List (Independent Scrolling) */}
      <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300 min-h-[150px]">
        {tasks.length === 0 ? (
          <div className="h-28 rounded-xl border border-dashed border-slate-300/70 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-[11px] font-semibold text-slate-400">No tasks in {column.title}</span>
            <button
              onClick={() => onAddTask(column.id)}
              className="mt-1.5 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
            >
              + Create task
            </button>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={onTaskClick}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};
