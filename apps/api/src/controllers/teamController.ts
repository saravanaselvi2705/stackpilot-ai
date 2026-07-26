import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getTeamDashboard = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await db.User.find({ isDeleted: false, isActive: true })
      .select('-password -passwordResetToken -passwordResetExpires')
      .sort({ name: 1 });

    const teamData = await Promise.all(
      users.map(async (u) => {
        const userObj = u.toObject();
        const activeTasks = await db.Task.find({
          assigneeId: u._id,
          status: { $in: ['Todo', 'In Progress', 'In Review'] },
          isDeleted: false,
        }).populate('projectId', 'name');

        const completedTasks = await db.Task.countDocuments({
          assigneeId: u._id,
          status: 'Done',
          isDeleted: false,
        });

        const activeProjects = await db.Project.find({
          'team.userId': u._id,
          isDeleted: false,
        }).select('name status');

        const totalTasks = activeTasks.length + completedTasks;
        const performanceScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

        return {
          ...userObj,
          activeTasksCount: activeTasks.length,
          activeTasks,
          completedTasksCount: completedTasks,
          activeProjectsCount: activeProjects.length,
          activeProjects,
          performanceScore,
        };
      })
    );

    return res.status(200).json(teamData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUserTeamStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { availability, leaveStatus, onlineStatus, workload, capacity } = req.body;

    const user = await db.User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (availability) user.availability = availability;
    if (leaveStatus) user.leaveStatus = leaveStatus;
    if (onlineStatus) user.onlineStatus = onlineStatus;
    if (workload !== undefined) user.workload = workload;
    if (capacity !== undefined) user.capacity = capacity;

    await user.save();

    return res.status(200).json({
      message: 'Team status updated successfully',
      user: {
        id: user._id,
        name: user.name,
        availability: user.availability,
        leaveStatus: user.leaveStatus,
        onlineStatus: user.onlineStatus,
        workload: user.workload,
        capacity: user.capacity,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
