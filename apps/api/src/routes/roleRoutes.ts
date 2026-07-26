import { Router } from 'express';
import * as roleCtrl from '../controllers/roleController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

router.get('/roles', requirePermission(PERMISSIONS.USERS_VIEW), roleCtrl.getRoles);
router.post('/roles', requirePermission(PERMISSIONS.SETTINGS_MANAGE), roleCtrl.createRole);
router.put('/roles/:id', requirePermission(PERMISSIONS.SETTINGS_MANAGE), roleCtrl.updateRole);
router.delete('/roles/:id', requirePermission(PERMISSIONS.SETTINGS_MANAGE), roleCtrl.deleteRole);

router.get('/permissions', requirePermission(PERMISSIONS.USERS_VIEW), roleCtrl.getPermissions);

export default router;
