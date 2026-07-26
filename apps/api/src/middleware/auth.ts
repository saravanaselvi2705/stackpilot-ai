import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as db from '../models';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions?: string[];
  };
}

export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Access token missing or invalid format' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ error: 'JWT configuration error' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string; role: string };
    
    // Check if user exists and is active
    const user = await db.User.findById(decoded.id).select('isActive role customPermissions');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User account no longer exists' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: user.role || decoded.role,
      permissions: user.customPermissions || [],
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
  }
};

export const requireRoles = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role permissions' });
    }

    next();
  };
};
