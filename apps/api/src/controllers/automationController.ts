import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getAutomationRules = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const rules = await db.AutomationRule.find().sort({ createdAt: -1 });
    return res.status(200).json(rules);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createAutomationRule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, trigger, condition, action } = req.body;
    if (!name || !trigger || !action) {
      return res.status(400).json({ error: 'Name, trigger, and action are required' });
    }

    const rule = new db.AutomationRule({
      name,
      trigger,
      condition,
      action,
      isActive: true,
    });

    await rule.save();
    return res.status(201).json(rule);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const toggleAutomationRule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rule = await db.AutomationRule.findById(id);
    if (!rule) return res.status(404).json({ error: 'Rule not found' });
    rule.isActive = !rule.isActive;
    await rule.save();
    return res.status(200).json(rule);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
