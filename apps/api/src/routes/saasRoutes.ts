import { Router } from 'express';
import * as saasCtrl from '../controllers/saasController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

router.get('/subscription', saasCtrl.getSubscriptionInfo);
router.post('/plan', requirePermission(PERMISSIONS.SETTINGS_MANAGE), saasCtrl.updatePlan);

export default router;
