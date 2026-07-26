import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';
import { PERMISSIONS } from '../constants/permissions';

export const getRoles = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const roles = await db.Role.find().sort({ createdAt: 1 });
    return res.status(200).json(roles);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPermissions = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const permissions = await db.Permission.find().sort({ module: 1, name: 1 });
    const allPermissionKeys = Object.values(PERMISSIONS);
    return res.status(200).json({
      permissions,
      permissionKeys: allPermissionKeys,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Role name is required' });
    }

    const existingRole = await db.Role.findOne({ name: name.trim() });
    if (existingRole) {
      return res.status(400).json({ error: 'Role with this name already exists' });
    }

    const role = new db.Role({
      name: name.trim(),
      description: description || '',
      permissions: permissions || [],
    });

    await role.save();

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Role Changed',
        details: `Created new role "${role.name}"`,
      }).save();
    }

    return res.status(201).json(role);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { description, permissions } = req.body;

    const role = await db.Role.findById(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    if (role.name === 'Super Admin') {
      return res.status(400).json({ error: 'Super Admin role permissions cannot be modified' });
    }

    if (description !== undefined) role.description = description;
    if (permissions !== undefined) role.permissions = permissions;

    await role.save();

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Permission Changed',
        details: `Updated permissions for role "${role.name}"`,
      }).save();
    }

    return res.status(200).json(role);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const role = await db.Role.findById(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    if (role.name === 'Super Admin' || role.name === 'Admin') {
      return res.status(400).json({ error: 'System core roles cannot be deleted' });
    }

    await db.Role.findByIdAndDelete(id);

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Role Changed',
        details: `Deleted role "${role.name}"`,
      }).save();
    }

    return res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
