import { API } from '../../../services/api';
import type { Task } from '../../../../../../packages/shared/types';

export const taskService = {
  async getTasks(projectId?: string): Promise<Task[]> {
    return API.tasks.list(projectId);
  },

  async createTask(taskData: Partial<Task>): Promise<Task> {
    return API.tasks.create(taskData);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return API.tasks.update(id, updates);
  },

  async deleteTask(id: string): Promise<void> {
    return API.tasks.delete(id);
  }
};
