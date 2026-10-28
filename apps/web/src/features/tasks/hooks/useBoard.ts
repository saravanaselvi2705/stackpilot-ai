import { useState, useCallback } from 'react';
import type { Task, TaskStatus } from '../../../../../../packages/shared/types';

export interface KanbanColumnDef {
  id: TaskStatus;
  title: string;
  bgColor: string; // Tailored subtle background tint
  borderColor: string;
  badgeBg: string;
  textColor: string;
}

export const KANBAN_COLUMNS: KanbanColumnDef[] = [
  { id: 'Backlog', title: 'Backlog', bgColor: 'bg-white', borderColor: 'border-slate-200', badgeBg: 'bg-slate-100 text-slate-700', textColor: 'text-slate-900' },
  { id: 'Todo', title: 'Todo', bgColor: 'bg-slate-50/80', borderColor: 'border-slate-200', badgeBg: 'bg-slate-200 text-slate-700', textColor: 'text-slate-800' },
  { id: 'In Progress', title: 'In Progress', bgColor: 'bg-amber-50/50', borderColor: 'border-amber-200/80', badgeBg: 'bg-amber-100 text-amber-800', textColor: 'text-amber-950' },
  { id: 'In Review', title: 'In Review', bgColor: 'bg-blue-50/50', borderColor: 'border-blue-200/80', badgeBg: 'bg-blue-100 text-blue-800', textColor: 'text-blue-950' },
  { id: 'Done', title: 'Done', bgColor: 'bg-emerald-50/50', borderColor: 'border-emerald-200/80', badgeBg: 'bg-emerald-100 text-emerald-800', textColor: 'text-emerald-950' },
  { id: 'Blocked', title: 'Blocked', bgColor: 'bg-rose-50/50', borderColor: 'border-rose-200/80', badgeBg: 'bg-rose-100 text-rose-800', textColor: 'text-rose-950' },
  { id: 'Cancelled', title: 'Cancelled', bgColor: 'bg-slate-100/60', borderColor: 'border-slate-200', badgeBg: 'bg-slate-200 text-slate-600', textColor: 'text-slate-700' },
];

export function useBoard(onUpdateTask: (id: string, updates: Partial<Task>) => Promise<any>) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  }, [dragOverColumn]);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetStatus: TaskStatus, targetSprintId?: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDraggedTaskId(null);
    setDragOverColumn(null);

    if (!taskId) return;

    const updates: Partial<Task> = { status: targetStatus };
    if (targetSprintId !== undefined) {
      updates.sprintId = targetSprintId;
    }

    try {
      await onUpdateTask(taskId, updates);
    } catch (err) {
      console.error('Failed to drop task', err);
    }
  }, [draggedTaskId, onUpdateTask]);

  return {
    draggedTaskId,
    dragOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
