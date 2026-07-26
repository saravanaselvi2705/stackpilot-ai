import { Router } from 'express';
import * as dashCtrl from '../controllers/dashboardController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/enterprise', dashCtrl.getEnterpriseDashboard);

export default router;
