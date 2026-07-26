import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getSubscriptionInfo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId || 'default-tenant';
    let tenant = await db.Tenant.findOne({ tenantId });

    if (!tenant) {
      tenant = new db.Tenant({
        tenantId,
        companyName: 'StackPilot Organization',
        plan: 'Enterprise',
        status: 'Active',
        billingCycle: 'Yearly',
        maxUsers: 100,
        maxProjects: 250,
      });
      await tenant.save();
    }

    const currentUsers = await db.User.countDocuments({ tenantId, isDeleted: false });
    const currentProjects = await db.Project.countDocuments({ tenantId, isDeleted: false });

    return res.status(200).json({
      tenant,
      usage: {
        users: { current: currentUsers, limit: tenant.maxUsers },
        projects: { current: currentProjects, limit: tenant.maxProjects },
      },
      availablePlans: [
        { name: 'Free Trial', price: '$0', users: 5, projects: 10, features: ['Core CRM', 'Basic Projects'] },
        { name: 'Pro', price: '$49/mo', users: 25, projects: 50, features: ['Full CRM', 'Jira Tasks', 'AI Generator'] },
        { name: 'Enterprise', price: '$199/mo', users: 'Unlimited', projects: 'Unlimited', features: ['Multi-tenant', 'Custom Integrations', '24/7 SLA'] },
      ],
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updatePlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId || 'default-tenant';
    const { plan } = req.body;

    const tenant = await db.Tenant.findOneAndUpdate({ tenantId }, { plan }, { new: true });
    return res.status(200).json(tenant);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
