import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import roleRoutes from './roleRoutes';
import profileRoutes from './profileRoutes';
import auditRoutes from './auditRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/system', roleRoutes);
router.use('/profile', profileRoutes);
router.use('/audit-logs', auditRoutes);

export default router;
