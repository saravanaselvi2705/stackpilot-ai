import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getEnterpriseDashboard = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    // Projects Metrics
    const totalProjects = await db.Project.countDocuments({ isDeleted: false });
    const activeProjects = await db.Project.countDocuments({ status: 'Active', isDeleted: false });
    const healthyProjects = await db.Project.countDocuments({ health: 'Healthy', isDeleted: false });
    const atRiskProjects = await db.Project.countDocuments({ health: 'At Risk', isDeleted: false });
    const delayedProjects = await db.Project.countDocuments({ health: 'Delayed', isDeleted: false });

    // Financial Metrics
    const projects = await db.Project.find({ isDeleted: false });
    const totalRevenue = projects.reduce((acc, p) => acc + (p.revenue || 0), 0);
    const totalExpenses = projects.reduce((acc, p) => acc + (p.expenses || 0), 0);
    const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);

    // Tasks Metrics
    const totalTasks = await db.Task.countDocuments({ isDeleted: false });
    const completedTasks = await db.Task.countDocuments({ status: 'Done', isDeleted: false });
    const inProgressTasks = await db.Task.countDocuments({ status: 'In Progress', isDeleted: false });
    const todoTasks = await db.Task.countDocuments({ status: 'Todo', isDeleted: false });

    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // CRM Metrics
    const totalClients = await db.Client.countDocuments({ isDeleted: false });
    const totalLeads = await db.Lead.countDocuments({ isDeleted: false });
    const wonLeads = await db.Lead.countDocuments({ status: 'Won', isDeleted: false });
    const leadConversionRate = totalLeads > 0 ? parseFloat(((wonLeads / totalLeads) * 100).toFixed(1)) : 0;

    // Funnel Stats
    const funnel = {
      new: await db.Lead.countDocuments({ status: 'New', isDeleted: false }),
      qualified: await db.Lead.countDocuments({ status: 'Qualified', isDeleted: false }),
      proposal: await db.Lead.countDocuments({ status: 'Proposal', isDeleted: false }),
      negotiation: await db.Lead.countDocuments({ status: 'Negotiation', isDeleted: false }),
      won: wonLeads,
      lost: await db.Lead.countDocuments({ status: 'Lost', isDeleted: false }),
    };

    // Recent Activities
    const recentActivities = await db.ActivityLog.find().sort({ createdAt: -1 }).limit(10);

    // Upcoming Deadlines (Tasks & Milestones due within next 7 days)
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = await db.Task.find({
      dueDate: { $gte: now, $lte: nextWeek },
      status: { $ne: 'Done' },
      isDeleted: false,
    }).populate('projectId', 'name').limit(5);

    // Monthly Revenue Mock Aggregation for Chart
    const monthlyRevenue = [
      { month: 'Jan', revenue: 45000, expenses: 28000 },
      { month: 'Feb', revenue: 52000, expenses: 31000 },
      { month: 'Mar', revenue: 61000, expenses: 35000 },
      { month: 'Apr', revenue: 58000, expenses: 33000 },
      { month: 'May', revenue: 73000, expenses: 40000 },
      { month: 'Jun', revenue: 85000, expenses: 42000 },
    ];

    return res.status(200).json({
      kpis: {
        totalRevenue,
        totalExpenses,
        totalBudget,
        netProfit: totalRevenue - totalExpenses,
        totalProjects,
        activeProjects,
        totalTasks,
        completedTasks,
        taskCompletionRate,
        totalClients,
        totalLeads,
        leadConversionRate,
      },
      projectHealth: {
        healthy: healthyProjects,
        atRisk: atRiskProjects,
        delayed: delayedProjects,
      },
      taskStatusBreakdown: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: completedTasks,
      },
      leadFunnel: funnel,
      monthlyRevenue,
      recentActivities,
      upcomingDeadlines,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
