import { useState, useEffect, useCallback, useMemo } from 'react';
import { taskService } from '../services/taskService';
import type { Task, TaskStatus, TaskPriority } from '../../../../../../packages/shared/types';

export interface TaskFilters {
  search: string;
  projectId: string;
  sprintId: string;
  status: string;
  priority: string;
  assigneeId: string;
  groupBy: 'status' | 'sprint' | 'priority' | 'assignee' | 'project';
}

export function useTasks(initialProjectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    projectId: initialProjectId || 'all',
    sprintId: 'all',
    status: 'all',
    priority: 'all',
    assigneeId: 'all',
    groupBy: 'status',
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasks(filters.projectId !== 'all' ? filters.projectId : undefined);
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters.projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData: Partial<Task>) => {
    const newTask = await taskService.createTask(taskData);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    // Optimistic update
    setTasks(prev => prev.map(t => (t._id === id ? { ...t, ...updates } : t)));
    try {
      const updated = await taskService.updateTask(id, updates);
      setTasks(prev => prev.map(t => (t._id === id ? updated : t)));
      return updated;
    } catch (err) {
      fetchTasks(); // rollback on error
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t._id !== id));
    try {
      await taskService.deleteTask(id);
    } catch (err) {
      fetchTasks();
      throw err;
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const titleMatch = t.title.toLowerCase().includes(query);
        const descMatch = t.description?.toLowerCase().includes(query);
        const idMatch = (t.taskId || t._id).toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !idMatch) return false;
      }

      if (filters.projectId !== 'all' && t.projectId !== filters.projectId) return false;
      
      if (filters.sprintId !== 'all') {
        if (filters.sprintId === 'backlog') {
          if (t.sprintId || t.status !== 'Backlog') return false;
        } else if (t.sprintId !== filters.sprintId) {
          return false;
        }
      }

      if (filters.status !== 'all' && t.status !== filters.status) return false;
      if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
      if (filters.assigneeId !== 'all' && t.assigneeId !== filters.assigneeId) return false;

      return true;
    });
  }, [tasks, filters]);

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    filters,
    setFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
