import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, sprintId, assigneeId, status, type, priority, search } = req.query;
    const filter: any = { isDeleted: false };

    if (projectId && typeof projectId === 'string') filter.projectId = projectId;
    if (sprintId && typeof sprintId === 'string') filter.sprintId = sprintId;
    if (assigneeId && typeof assigneeId === 'string') filter.assigneeId = assigneeId;
    if (status && typeof status === 'string') filter.status = status;
    if (type && typeof type === 'string') filter.type = type;
    if (priority && typeof priority === 'string') filter.priority = priority;

    if (search && typeof search === 'string') {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await db.Task.find(filter)
      .populate('assigneeId', 'name email avatarUrl')
      .populate('reporterId', 'name email avatarUrl')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(tasks);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await db.Task.findOne({ _id: id, isDeleted: false })
      .populate('assigneeId', 'name email avatarUrl department')
      .populate('reporterId', 'name email avatarUrl')
      .populate('projectId', 'name')
      .populate('comments.userId', 'name email avatarUrl');

    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.status(200).json(task);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, title, description, type, priority, assigneeId, dueDate, labels, estimatedTime, storyPoints, checklist } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ error: 'ProjectId and title are required' });
    }

    const task = new db.Task({
      projectId,
      title,
      description,
      type: type || 'Task',
      status: 'Todo',
      priority: priority || 'Medium',
      assigneeId,
      reporterId: req.user ? req.user.id : undefined,
      dueDate,
      labels: labels || [],
      estimatedTime: estimatedTime || 0,
      storyPoints: storyPoints || 1,
      checklist: checklist || [],
    });

    await task.save();

    // Trigger Notification if assigned
    if (assigneeId) {
      await new db.Notification({
        userId: assigneeId,
        title: 'New Task Assigned',
        message: `You were assigned task "${task.title}"`,
        type: 'assignment',
        entityType: 'Task',
        entityId: task._id,
      }).save();
    }

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Task Action',
        details: `Created task "${task.title}"`,
      }).save();
    }

    return res.status(201).json(task);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const oldTask = await db.Task.findOne({ _id: id, isDeleted: false });
    if (!oldTask) return res.status(404).json({ error: 'Task not found' });

    const updatedTask = await db.Task.findByIdAndUpdate(id, updates, { new: true })
      .populate('assigneeId', 'name email avatarUrl')
      .populate('reporterId', 'name email avatarUrl');

    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });

    // Track status change history & send notification
    if (updates.status && updates.status !== oldTask.status) {
      updatedTask.history.push({
        field: 'status',
        oldValue: oldTask.status,
        newValue: updates.status,
        updatedBy: req.user ? req.user.email : 'System',
        updatedAt: new Date(),
      });
      await updatedTask.save();

      if (updatedTask.assigneeId) {
        await new db.Notification({
          userId: (updatedTask.assigneeId as any)._id || updatedTask.assigneeId,
          title: 'Task Status Updated',
          message: `Task "${updatedTask.title}" status changed to ${updates.status}`,
          type: 'status_change',
          entityType: 'Task',
          entityId: updatedTask._id,
        }).save();
      }
    }

    return res.status(200).json(updatedTask);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await db.Task.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.status(200).json({ message: 'Task soft-deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { text, mentions } = req.body;

    if (!text) return res.status(400).json({ error: 'Comment text is required' });
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const task = await db.Task.findOne({ _id: id, isDeleted: false });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const comment = {
      userId: user._id,
      userName: user.name,
      userAvatar: user.avatarUrl,
      text,
      mentions: mentions || [],
      createdAt: new Date(),
    };

    task.comments.push(comment as any);
    await task.save();

    // Trigger Notification for mentions
    if (mentions && Array.isArray(mentions)) {
      for (const mUserId of mentions) {
        await new db.Notification({
          userId: mUserId,
          title: 'You were mentioned in a comment',
          message: `${user.name} mentioned you in task "${task.title}"`,
          type: 'mention',
          entityType: 'Task',
          entityId: task._id,
        }).save();
      }
    }

    return res.status(200).json(task);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addSubtask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Subtask title is required' });

    const task = await db.Task.findOne({ _id: id, isDeleted: false });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.subtasks.push({ title, completed: false });
    await task.save();

    return res.status(200).json(task);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const logTime = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { hours } = req.body;
    if (!hours || isNaN(hours)) return res.status(400).json({ error: 'Valid hours are required' });

    const task = await db.Task.findOne({ _id: id, isDeleted: false });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.loggedTime = (task.loggedTime || 0) + Number(hours);
    await task.save();

    return res.status(200).json(task);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
