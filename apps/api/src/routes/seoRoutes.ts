import { Router } from 'express';
import * as seoCtrl from '../controllers/seoController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

router.get('/dashboard', requirePermission(PERMISSIONS.SEO_MANAGE), seoCtrl.getSEODashboard);
router.get('/keywords', requirePermission(PERMISSIONS.SEO_MANAGE), seoCtrl.getKeywords);
router.post('/keywords', requirePermission(PERMISSIONS.SEO_MANAGE), seoCtrl.addKeyword);

export default router;
