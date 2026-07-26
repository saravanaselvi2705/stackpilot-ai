import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, status, priority, health } = req.query;
    const filter: any = { isDeleted: false };

    if (search && typeof search === 'string') {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && typeof status === 'string') filter.status = status;
    if (priority && typeof priority === 'string') filter.priority = priority;
    if (health && typeof health === 'string') filter.health = health;

    const projects = await db.Project.find(filter)
      .populate('clientId', 'name email companyName')
      .populate('projectManagerId', 'name email avatarUrl')
      .populate('team.userId', 'name email role avatarUrl')
      .sort({ createdAt: -1 });

    return res.status(200).json(projects);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await db.Project.findOne({ _id: id, isDeleted: false })
      .populate('clientId', 'name email companyName')
      .populate('projectManagerId', 'name email avatarUrl')
      .populate('team.userId', 'name email role avatarUrl');

    if (!project) return res.status(404).json({ error: 'Project not found' });

    const tasks = await db.Task.find({ projectId: id, isDeleted: false });
    const documents = await db.Document.find({ projectId: id });

    return res.status(200).json({
      ...project.toObject(),
      tasksCount: tasks.length,
      completedTasksCount: tasks.filter(t => t.status === 'Done').length,
      documents,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, priority, budget, expenses, revenue, startDate, endDate, client, clientId, projectManagerId, team } = req.body;

    if (!name) return res.status(400).json({ error: 'Project name is required' });

    const newProject = new db.Project({
      name,
      description,
      priority: priority || 'Medium',
      status: 'Planning',
      health: 'Healthy',
      budget: budget || 0,
      expenses: expenses || 0,
      revenue: revenue || 0,
      startDate,
      endDate,
      client,
      clientId,
      projectManagerId: projectManagerId || (req.user ? req.user.id : undefined),
      team: team || (req.user ? [{ userId: req.user.id, role: 'Project Manager' }] : []),
    });

    await newProject.save();

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Create Project',
        details: `Created new project "${name}"`,
      }).save();
    }

    return res.status(201).json(newProject);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await db.Project.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true }
    );

    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Project Action',
        details: `Updated details for project "${project.name}"`,
      }).save();
    }

    return res.status(200).json(project);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await db.Project.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Project Action',
        details: `Soft-deleted project "${project.name}"`,
      }).save();
    }

    return res.status(200).json({ message: 'Project soft-deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addMilestone = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, dueDate } = req.body;

    if (!title) return res.status(400).json({ error: 'Milestone title is required' });

    const project = await db.Project.findOne({ _id: id, isDeleted: false });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    project.milestones.push({ title, dueDate, completed: false });
    await project.save();

    return res.status(200).json(project);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const toggleMilestone = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, milestoneId } = req.params;

    const project = await db.Project.findOne({ _id: id, isDeleted: false });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const milestone = (project.milestones as any).id(milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    milestone.completed = !milestone.completed;
    await project.save();

    return res.status(200).json(project);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
