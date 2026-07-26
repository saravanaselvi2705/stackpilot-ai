import { Router } from 'express';
import * as notifCtrl from '../controllers/notificationController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', notifCtrl.getNotifications);
router.get('/unread-count', notifCtrl.getUnreadCount);
router.patch('/:id/read', notifCtrl.markAsRead);
router.patch('/mark-all-read', notifCtrl.markAllAsRead);

export default router;
