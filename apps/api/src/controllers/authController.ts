import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import validator from 'validator';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';
import { EmailService } from '../utils/emailService';

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password must be valid strings' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (cleanPassword.length === 0) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await db.User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    await user.save();

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT configuration error' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Audit Log
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';
    await new db.ActivityLog({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'Login',
      details: 'User logged in successfully',
      ipAddress: ip,
      userAgent,
    }).save();

    return res.status(200).json({
      token,
      mustChangePassword: user.mustChangePassword || false,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatarUrl: user.avatarUrl,
        availability: user.availability,
        twoFAEnabled: user.twoFAEnabled,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user) {
      const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || '';
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Logout',
        details: 'User logged out successfully',
        ipAddress: ip,
        userAgent,
      }).save();
    }

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await db.User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(200).json({
        message: 'If an account exists, a password reset link has been sent.',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await EmailService.sendForgotPassword(user.email, user.name, resetUrl);

    // Audit log
    await new db.ActivityLog({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'Password Reset Request',
      details: 'Password reset link sent to user email',
    }).save();

    return res.status(200).json({
      message: 'If an account exists, a password reset link has been sent.',
    });
  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to process forgot password' });
  }
};

export const resetPassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || typeof token !== 'string' || !password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = await db.User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.mustChangePassword = false;

    await user.save();

    try {
      await EmailService.sendPasswordChanged(user.email, user.name);
    } catch (mailErr) {
      console.warn('Failed to send password change confirmation email:', mailErr);
    }

    // Audit log
    await new db.ActivityLog({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'Password Reset',
      details: 'User successfully reset password using token',
    }).save();

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error: any) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.trim().length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    user.password = await bcrypt.hash(newPassword.trim(), 10);
    user.mustChangePassword = false;
    await user.save();

    try {
      await EmailService.sendPasswordChanged(user.email, user.name);
    } catch (mailErr) {
      console.warn('Failed to send password change confirmation email:', mailErr);
    }

    // Audit log
    await new db.ActivityLog({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'Password Changed',
      details: 'User changed their password',
    }).save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
