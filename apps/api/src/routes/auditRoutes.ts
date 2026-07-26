import { Router } from 'express';
import * as auditCtrl from '../controllers/auditController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

router.get('/', requirePermission(PERMISSIONS.REPORTS_VIEW), auditCtrl.getAuditLogs);

export default router;
