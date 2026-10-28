import { Router } from 'express';
import * as sprintCtrl from '../controllers/sprintController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

router.get('/', sprintCtrl.getSprints);
router.post('/', requirePermission(PERMISSIONS.PROJECTS_CREATE), sprintCtrl.createSprint);
router.get('/:id', sprintCtrl.getSprintById);
router.put('/:id', requirePermission(PERMISSIONS.PROJECTS_UPDATE), sprintCtrl.updateSprint);
router.delete('/:id', requirePermission(PERMISSIONS.PROJECTS_DELETE), sprintCtrl.deleteSprint);

router.post('/:id/start', requirePermission(PERMISSIONS.PROJECTS_UPDATE), sprintCtrl.startSprint);
router.post('/:id/complete', requirePermission(PERMISSIONS.PROJECTS_UPDATE), sprintCtrl.completeSprint);
router.post('/:id/archive', requirePermission(PERMISSIONS.PROJECTS_UPDATE), sprintCtrl.archiveSprint);
router.post('/:id/duplicate', requirePermission(PERMISSIONS.PROJECTS_CREATE), sprintCtrl.duplicateSprint);

export default router;
