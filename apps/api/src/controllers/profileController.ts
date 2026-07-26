import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await db.User.findById(req.user.id).select('-password -passwordResetToken -passwordResetExpires');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch role permissions
    const roleDoc = await db.Role.findOne({ name: user.role });
    const rolePermissions = roleDoc ? roleDoc.permissions : [];

    return res.status(200).json({
      ...user.toObject(),
      effectivePermissions: Array.from(new Set([...rolePermissions, ...(user.customPermissions || [])])),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { name, department, skills, experience, availability, twoFAEnabled } = req.body;

    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name.trim();
    if (department) user.department = department;
    if (skills) user.skills = skills;
    if (experience !== undefined) user.experience = experience;
    if (availability) user.availability = availability;
    if (twoFAEnabled !== undefined) user.twoFAEnabled = twoFAEnabled;

    await user.save();

    await new db.ActivityLog({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'User Updated',
      details: 'User updated their personal profile details',
    }).save();

    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const uploadAvatarHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ error: 'No avatar file uploaded' });

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await db.User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    await new db.ActivityLog({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'User Updated',
      details: 'User updated profile avatar picture',
    }).save();

    return res.status(200).json({
      message: 'Avatar uploaded successfully',
      avatarUrl: user.avatarUrl,
      user,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const toggle2FA = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { enabled } = req.body;

    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.twoFAEnabled = enabled !== undefined ? Boolean(enabled) : !user.twoFAEnabled;
    await user.save();

    await new db.ActivityLog({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'User Updated',
      details: `User ${user.twoFAEnabled ? 'enabled' : 'disabled'} Two-Factor Authentication (2FA)`,
    }).save();

    return res.status(200).json({
      message: `Two-Factor Authentication ${user.twoFAEnabled ? 'enabled' : 'disabled'}`,
      twoFAEnabled: user.twoFAEnabled,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getLoginHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const history = await db.ActivityLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json(history);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
