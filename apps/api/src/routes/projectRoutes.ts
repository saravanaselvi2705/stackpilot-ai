import { Router } from 'express';
import * as projectCtrl from '../controllers/projectController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

router.get('/', requirePermission(PERMISSIONS.PROJECTS_CREATE), projectCtrl.getProjects);
router.post('/', requirePermission(PERMISSIONS.PROJECTS_CREATE), projectCtrl.createProject);
router.get('/:id', requirePermission(PERMISSIONS.PROJECTS_CREATE), projectCtrl.getProjectById);
router.put('/:id', requirePermission(PERMISSIONS.PROJECTS_UPDATE), projectCtrl.updateProject);
router.delete('/:id', requirePermission(PERMISSIONS.PROJECTS_DELETE), projectCtrl.deleteProject);

router.post('/:id/milestones', requirePermission(PERMISSIONS.PROJECTS_UPDATE), projectCtrl.addMilestone);
router.patch('/:id/milestones/:milestoneId/toggle', requirePermission(PERMISSIONS.PROJECTS_UPDATE), projectCtrl.toggleMilestone);

export default router;
