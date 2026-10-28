import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getSprints = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, status } = req.query;
    const filter: any = { isDeleted: false };
    if (projectId && typeof projectId === 'string') filter.projectId = projectId;
    if (status && typeof status === 'string') filter.status = status;

    const sprints = await db.Sprint.find(filter)
      .populate('projectId', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(sprints);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSprintById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const sprint = await db.Sprint.findOne({ _id: id, isDeleted: false }).populate('projectId', 'name');
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });
    return res.status(200).json(sprint);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createSprint = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, name, goal, description, startDate, endDate, capacity } = req.body;
    if (!projectId || !name || !startDate || !endDate) {
      return res.status(400).json({ error: 'ProjectId, name, startDate, and endDate are required' });
    }

    const sprint = new db.Sprint({
      projectId,
      name,
      goal: goal || '',
      description: description || '',
      startDate,
      endDate,
      status: 'Planning',
      capacity: capacity || 40,
      createdBy: req.user ? req.user.id : undefined,
    });

    await sprint.save();

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Sprint Created',
        details: `Created sprint "${sprint.name}"`,
      }).save();
    }

    return res.status(201).json(sprint);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateSprint = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const sprint = await db.Sprint.findOne({ _id: id, isDeleted: false });
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });

    // Enforce single active sprint per project rule
    if (updates.status === 'Active' && sprint.status !== 'Active') {
      await db.Sprint.updateMany(
        { projectId: sprint.projectId, _id: { $ne: id }, status: 'Active' },
        { $set: { status: 'Planning' } }
      );
    }

    const updatedSprint = await db.Sprint.findByIdAndUpdate(id, updates, { new: true });
    return res.status(200).json(updatedSprint);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteSprint = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const sprint = await db.Sprint.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });

    // Move tasks belonging to this sprint back to Backlog
    await db.Task.updateMany({ sprintId: id }, { $unset: { sprintId: 1 }, $set: { status: 'Backlog' } });

    return res.status(200).json({ message: 'Sprint soft-deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const startSprint = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const sprint = await db.Sprint.findOne({ _id: id, isDeleted: false });
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });

    // Set all other active sprints for project to Planning
    await db.Sprint.updateMany(
      { projectId: sprint.projectId, _id: { $ne: id }, status: 'Active' },
      { $set: { status: 'Planning' } }
    );

    sprint.status = 'Active';
    await sprint.save();

    return res.status(200).json(sprint);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const completeSprint = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { targetSprintId } = req.body; // sprint to move incomplete tasks to

    const sprint = await db.Sprint.findOne({ _id: id, isDeleted: false });
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });

    sprint.status = 'Completed';
    await sprint.save();

    // Move incomplete tasks to target sprint or Backlog
    if (targetSprintId) {
      await db.Task.updateMany(
        { sprintId: id, status: { $ne: 'Done' } },
        { $set: { sprintId: targetSprintId } }
      );
    } else {
      await db.Task.updateMany(
        { sprintId: id, status: { $ne: 'Done' } },
        { $unset: { sprintId: 1 }, $set: { status: 'Backlog' } }
      );
    }

    return res.status(200).json(sprint);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const archiveSprint = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const sprint = await db.Sprint.findByIdAndUpdate(id, { status: 'Archived' }, { new: true });
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });
    return res.status(200).json(sprint);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const duplicateSprint = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const sprint = await db.Sprint.findOne({ _id: id, isDeleted: false });
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });

    const duplicated = new db.Sprint({
      projectId: sprint.projectId,
      name: `${sprint.name} (Copy)`,
      goal: sprint.goal,
      description: sprint.description,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: 'Planning',
      capacity: sprint.capacity,
      createdBy: req.user ? req.user.id : undefined,
    });

    await duplicated.save();
    return res.status(201).json(duplicated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
