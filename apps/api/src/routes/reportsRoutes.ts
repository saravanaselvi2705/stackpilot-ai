import { Router } from 'express';
import * as repCtrl from '../controllers/reportsController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

router.get('/export', requirePermission(PERMISSIONS.REPORTS_VIEW), repCtrl.getExportReport);

export default router;
