import bcrypt from 'bcryptjs';
import * as db from '../models';
import { DEFAULT_ROLES } from '../constants/roles';
import { PERMISSIONS, DEFAULT_ROLE_PERMISSIONS } from '../constants/permissions';

export const seedDatabase = async () => {
  try {
    // 1. Seed Permissions
    const permissionKeys = Object.values(PERMISSIONS);
    for (const pKey of permissionKeys) {
      const moduleName = pKey.split('.')[0] || 'system';
      await db.Permission.findOneAndUpdate(
        { name: pKey },
        {
          name: pKey,
          description: `Permission to ${pKey.replace('.', ' ')}`,
          module: moduleName,
        },
        { upsert: true, new: true }
      );
    }

    // 2. Seed Roles
    for (const roleName of DEFAULT_ROLES) {
      const permissions = DEFAULT_ROLE_PERMISSIONS[roleName] || [];
      await db.Role.findOneAndUpdate(
        { name: roleName },
        {
          name: roleName,
          description: `${roleName} role with predefined access permissions.`,
          permissions: permissions,
        },
        { upsert: true, new: true }
      );
    }

    // 3. Seed Super Admin (Single System Admin, no demo users)
    const superAdminEmail = 'admin@stackpilot.ai';
    const existingSuperAdmin = await db.User.findOne({ email: superAdminEmail });

    if (!existingSuperAdmin) {
      const passwordHash = await bcrypt.hash('password123', 10);
      const adminUser = new db.User({
        name: 'Super Admin',
        email: superAdminEmail,
        password: passwordHash,
        role: 'Super Admin',
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=Admin`,
        department: 'Administration',
        skills: ['Architecture', 'Security', 'Management'],
        experience: '10+ years',
        availability: 'Available',
        twoFAEnabled: false,
        isActive: true,
        mustChangePassword: false,
      });

      await adminUser.save();
      console.log('✅ Super Admin created successfully (admin@stackpilot.ai).');
    } else {
      console.log('Database already seeded with Super Admin.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
