import { API } from '../../../services/api';
import type { Sprint, SprintReport, Release } from '../../../../../../packages/shared/types';

export const sprintService = {
  async getSprints(projectId?: string): Promise<Sprint[]> {
    return API.sprints.list(projectId);
  },

  async createSprint(sprintData: Partial<Sprint>): Promise<Sprint> {
    return API.sprints.create(sprintData);
  },

  async updateSprint(id: string, updates: Partial<Sprint>): Promise<Sprint> {
    return API.sprints.update(id, updates);
  },

  async deleteSprint(id: string): Promise<void> {
    return API.sprints.delete(id);
  },

  async startSprint(id: string): Promise<Sprint> {
    return API.sprints.start(id);
  },

  async completeSprint(id: string, targetSprintId?: string): Promise<Sprint> {
    return API.sprints.complete(id, targetSprintId);
  },

  async archiveSprint(id: string): Promise<Sprint> {
    return API.sprints.archive(id);
  },

  async duplicateSprint(id: string): Promise<Sprint> {
    return API.sprints.duplicate(id);
  },

  async getSprintReport(sprintId: string): Promise<SprintReport> {
    return API.sprintReports.getReport(sprintId);
  },

  async getReleases(projectId?: string): Promise<Release[]> {
    return API.releases.list(projectId);
  },

  async createRelease(releaseData: Partial<Release>): Promise<Release> {
    return API.releases.create(releaseData);
  },

  async updateRelease(id: string, updates: Partial<Release>): Promise<Release> {
    return API.releases.update(id, updates);
  },

  async deleteRelease(id: string): Promise<void> {
    return API.releases.delete(id);
  }
};
