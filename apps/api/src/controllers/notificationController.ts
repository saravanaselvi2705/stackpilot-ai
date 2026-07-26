import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const notifications = await db.Notification.find({
      userId: req.user.id,
      isDeleted: false,
    }).sort({ createdAt: -1 }).limit(50);

    const unreadCount = await db.Notification.countDocuments({
      userId: req.user.id,
      read: false,
      isDeleted: false,
    });

    return res.status(200).json({
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUnreadCount = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const unreadCount = await db.Notification.countDocuments({
      userId: req.user.id,
      read: false,
      isDeleted: false,
    });

    return res.status(200).json({ unreadCount });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;

    const notification = await db.Notification.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    return res.status(200).json(notification);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    await db.Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
