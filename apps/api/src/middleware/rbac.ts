import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import * as db from '../models';

export const requirePermission = (permission: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: Authentication required' });
      }

      // Super Admin has unrestricted permissions
      if (req.user.role === 'Super Admin') {
        return next();
      }

      // Fetch user's role permissions from DB
      const roleDoc = await db.Role.findOne({ name: req.user.role });
      const rolePermissions: string[] = roleDoc ? roleDoc.permissions : [];
      const userPermissions: string[] = req.user.permissions || [];

      const allPermissions = new Set([...rolePermissions, ...userPermissions]);

      if (!allPermissions.has(permission)) {
        return res.status(403).json({
          error: `Forbidden: Missing required permission '${permission}'`
        });
      }

      next();
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Authorization evaluation failed' });
    }
  };
};
