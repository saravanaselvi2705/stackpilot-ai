import { Router } from 'express';
import * as authCtrl from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', authCtrl.login);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);

// Protected routes
router.post('/logout', authenticateJWT, authCtrl.logout);
router.post('/change-password', authenticateJWT, authCtrl.changePassword);

export default router;
