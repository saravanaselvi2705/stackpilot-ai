import { Router } from 'express';
import * as userCtrl from '../controllers/userController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

router.get('/', requirePermission(PERMISSIONS.USERS_VIEW), userCtrl.getUsers);
router.post('/', requirePermission(PERMISSIONS.USERS_CREATE), userCtrl.createUser);
router.get('/:id', requirePermission(PERMISSIONS.USERS_VIEW), userCtrl.getUserById);
router.put('/:id', requirePermission(PERMISSIONS.USERS_UPDATE), userCtrl.updateUser);
router.delete('/:id', requirePermission(PERMISSIONS.USERS_DELETE), userCtrl.deleteUser);
router.patch('/:id/activate', requirePermission(PERMISSIONS.USERS_UPDATE), userCtrl.activateUser);
router.patch('/:id/deactivate', requirePermission(PERMISSIONS.USERS_UPDATE), userCtrl.deactivateUser);
router.post('/:id/reset-password', requirePermission(PERMISSIONS.USERS_UPDATE), userCtrl.resetUserPassword);

export default router;
