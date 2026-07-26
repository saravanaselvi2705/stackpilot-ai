import { Router } from 'express';
import * as autoCtrl from '../controllers/automationController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

router.get('/rules', requirePermission(PERMISSIONS.SETTINGS_MANAGE), autoCtrl.getAutomationRules);
router.post('/rules', requirePermission(PERMISSIONS.SETTINGS_MANAGE), autoCtrl.createAutomationRule);
router.patch('/rules/:id/toggle', requirePermission(PERMISSIONS.SETTINGS_MANAGE), autoCtrl.toggleAutomationRule);

export default router;
