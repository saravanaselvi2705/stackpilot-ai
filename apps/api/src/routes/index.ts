import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import roleRoutes from './roleRoutes';
import profileRoutes from './profileRoutes';
import auditRoutes from './auditRoutes';
import crmRoutes from './crmRoutes';
import projectRoutes from './projectRoutes';
import taskRoutes from './taskRoutes';
import teamRoutes from './teamRoutes';
import notificationRoutes from './notificationRoutes';
import dashboardRoutes from './dashboardRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/system', roleRoutes);
router.use('/profile', profileRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/crm', crmRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/team', teamRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
