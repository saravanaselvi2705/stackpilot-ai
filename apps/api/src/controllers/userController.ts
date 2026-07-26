import { Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import validator from 'validator';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';
import { EmailService } from '../utils/emailService';

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    const { search, role, department, isActive, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter: any = {};

    if (search && typeof search === 'string') {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && typeof role === 'string') {
      filter.role = role;
    }

    if (department && typeof department === 'string') {
      filter.department = department;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions: any = { [sortBy as string]: sortOrder };

    const total = await db.User.countDocuments(filter);
    const users = await db.User.find(filter)
      .select('-password -passwordResetToken -passwordResetExpires')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.User.findById(id).select('-password -passwordResetToken -passwordResetExpires');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, role, department, skills, experience, availability } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const existingUser = await db.User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Generate temporary random password
    const tempPassword = crypto.randomBytes(6).toString('hex'); // 12-char temp pass
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = new db.User({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'Developer',
      department: department || 'General',
      skills: skills || [],
      experience: experience || '',
      availability: availability || 'Available',
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      twoFAEnabled: false,
      isActive: true,
      mustChangePassword: true,
      invited: true,
      createdBy: req.user ? req.user.id : undefined,
    });

    await newUser.save();

    // Send invitation email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const loginUrl = `${frontendUrl}/login`;
    try {
      await EmailService.sendInvitation(newUser.email, newUser.name, tempPassword, loginUrl);
    } catch (emailErr) {
      console.warn('User created but failed to send invitation email:', emailErr);
    }

    // Audit log
    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'User Created',
        details: `Created new user "${newUser.name}" (${newUser.email}) with role ${newUser.role}`,
      }).save();
    }

    return res.status(201).json({
      message: 'User created successfully and invitation email sent',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        avatarUrl: newUser.avatarUrl,
        isActive: newUser.isActive,
        mustChangePassword: newUser.mustChangePassword,
        createdAt: newUser.createdAt,
      },
      tempPassword,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, department, role, skills, experience, availability, customPermissions } = req.body;

    const user = await db.User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (department) user.department = department;
    if (skills) user.skills = skills;
    if (experience !== undefined) user.experience = experience;
    if (availability) user.availability = availability;
    
    let roleChanged = false;
    if (role && role !== user.role) {
      user.role = role;
      roleChanged = true;
    }

    if (customPermissions !== undefined) {
      user.customPermissions = customPermissions;
    }

    await user.save();

    // Audit log
    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: roleChanged ? 'Role Changed' : 'User Updated',
        details: roleChanged ? `Updated user ${user.email} role to ${user.role}` : `Updated profile for user ${user.email}`,
      }).save();
    }

    return res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        skills: user.skills,
        availability: user.availability,
        customPermissions: user.customPermissions,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user && req.user.id === id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const user = await db.User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Audit log
    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'User Deleted',
        details: `Deleted user ${user.name} (${user.email})`,
      }).save();
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const activateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = true;
    await user.save();

    try {
      await EmailService.sendAccountStatus(user.email, user.name, true);
    } catch (mailErr) {
      console.warn('Failed to send account activation email:', mailErr);
    }

    // Audit log
    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Account Enabled',
        details: `Enabled account for user ${user.email}`,
      }).save();
    }

    return res.status(200).json({ message: 'User account activated', isActive: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deactivateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user && req.user.id === id) {
      return res.status(400).json({ error: 'You cannot deactivate your own account' });
    }

    const user = await db.User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    try {
      await EmailService.sendAccountStatus(user.email, user.name, false);
    } catch (mailErr) {
      console.warn('Failed to send account deactivation email:', mailErr);
    }

    // Audit log
    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Account Disabled',
        details: `Disabled account for user ${user.email}`,
      }).save();
    }

    return res.status(200).json({ message: 'User account deactivated', isActive: false });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const resetUserPassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const tempPassword = crypto.randomBytes(6).toString('hex');
    user.password = await bcrypt.hash(tempPassword, 10);
    user.mustChangePassword = true;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    try {
      await EmailService.sendInvitation(user.email, user.name, tempPassword, `${frontendUrl}/login`);
    } catch (mailErr) {
      console.warn('Password reset by admin, failed to send email:', mailErr);
    }

    // Audit log
    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Password Reset',
        details: `Admin reset password for user ${user.email}`,
      }).save();
    }

    return res.status(200).json({
      message: 'Password reset successfully. Temporary password sent to user.',
      tempPassword,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
