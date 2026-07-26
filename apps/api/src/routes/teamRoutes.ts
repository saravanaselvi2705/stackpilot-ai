import { Router } from 'express';
import * as teamCtrl from '../controllers/teamController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

router.get('/dashboard', requirePermission(PERMISSIONS.USERS_VIEW), teamCtrl.getTeamDashboard);
router.patch('/users/:id/status', requirePermission(PERMISSIONS.USERS_UPDATE), teamCtrl.updateUserTeamStatus);

export default router;
