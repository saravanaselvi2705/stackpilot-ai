import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getCalendarEvents = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const tasks = await db.Task.find({ dueDate: { $ne: null }, isDeleted: false }).populate('projectId', 'name');
    const meetings = await db.Meeting.find();
    const projects = await db.Project.find({ endDate: { $ne: null }, isDeleted: false });

    const taskEvents = tasks.map(t => ({
      id: t._id,
      title: `Task: ${t.title}`,
      date: t.dueDate,
      type: 'Task',
      status: t.status,
      project: (t.projectId as any)?.name || 'General',
    }));

    const meetingEvents = meetings.map(m => ({
      id: m._id,
      title: `Meeting: ${m.title}`,
      date: m.date,
      type: 'Meeting',
      status: m.status,
      duration: m.duration,
    }));

    const milestoneEvents = projects.flatMap(p => 
      p.milestones.map(m => ({
        id: m._id,
        title: `Milestone (${p.name}): ${m.title}`,
        date: m.dueDate,
        type: 'Milestone',
        status: m.completed ? 'Completed' : 'Pending',
      }))
    );

    return res.status(200).json({
      events: [...taskEvents, ...meetingEvents, ...milestoneEvents],
      syncStatus: { googleCalendar: 'Connected', outlook: 'Ready' },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
