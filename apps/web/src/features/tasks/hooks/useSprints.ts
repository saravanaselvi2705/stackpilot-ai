import { useState, useEffect, useCallback, useMemo } from 'react';
import { sprintService } from '../services/sprintService';
import type { Sprint, SprintReport, Release } from '../../../../../../packages/shared/types';

export function useSprints(projectId?: string) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSprints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [sData, rData] = await Promise.all([
        sprintService.getSprints(projectId),
        sprintService.getReleases(projectId)
      ]);
      setSprints(sData);
      setReleases(rData);
    } catch (err: any) {
      setError(err.message || 'Failed to load sprints');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const activeSprint = useMemo(() => {
    return sprints.find(s => s.status === 'Active') || null;
  }, [sprints]);

  const planningSprints = useMemo(() => {
    return sprints.filter(s => s.status === 'Planning');
  }, [sprints]);

  const completedSprints = useMemo(() => {
    return sprints.filter(s => s.status === 'Completed');
  }, [sprints]);

  const createSprint = async (data: Partial<Sprint>) => {
    const created = await sprintService.createSprint(data);
    setSprints(prev => [created, ...prev]);
    return created;
  };

  const updateSprint = async (id: string, updates: Partial<Sprint>) => {
    setSprints(prev => prev.map(s => (s._id === id ? { ...s, ...updates } : s)));
    const updated = await sprintService.updateSprint(id, updates);
    fetchSprints();
    return updated;
  };

  const deleteSprint = async (id: string) => {
    setSprints(prev => prev.filter(s => s._id !== id));
    await sprintService.deleteSprint(id);
  };

  const startSprint = async (id: string) => {
    const updated = await sprintService.startSprint(id);
    fetchSprints();
    return updated;
  };

  const completeSprint = async (id: string, targetSprintId?: string) => {
    const updated = await sprintService.completeSprint(id, targetSprintId);
    fetchSprints();
    return updated;
  };

  const archiveSprint = async (id: string) => {
    const updated = await sprintService.archiveSprint(id);
    fetchSprints();
    return updated;
  };

  const duplicateSprint = async (id: string) => {
    const created = await sprintService.duplicateSprint(id);
    setSprints(prev => [created, ...prev]);
    return created;
  };

  const createRelease = async (data: Partial<Release>) => {
    const created = await sprintService.createRelease(data);
    setReleases(prev => [created, ...prev]);
    return created;
  };

  const updateRelease = async (id: string, updates: Partial<Release>) => {
    const updated = await sprintService.updateRelease(id, updates);
    setReleases(prev => prev.map(r => (r._id === id ? updated : r)));
    return updated;
  };

  const deleteRelease = async (id: string) => {
    setReleases(prev => prev.filter(r => r._id !== id));
    await sprintService.deleteRelease(id);
  };

  return {
    sprints,
    activeSprint,
    planningSprints,
    completedSprints,
    releases,
    loading,
    error,
    fetchSprints,
    createSprint,
    updateSprint,
    deleteSprint,
    startSprint,
    completeSprint,
    archiveSprint,
    duplicateSprint,
    createRelease,
    updateRelease,
    deleteRelease
  };
}
