import { Router } from 'express';
import * as taskCtrl from '../controllers/taskController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

router.get('/', requirePermission(PERMISSIONS.TASKS_UPDATE), taskCtrl.getTasks);
router.post('/', requirePermission(PERMISSIONS.TASKS_CREATE), taskCtrl.createTask);
router.get('/:id', requirePermission(PERMISSIONS.TASKS_UPDATE), taskCtrl.getTaskById);
router.put('/:id', requirePermission(PERMISSIONS.TASKS_UPDATE), taskCtrl.updateTask);
router.delete('/:id', requirePermission(PERMISSIONS.TASKS_UPDATE), taskCtrl.deleteTask);

router.post('/:id/comments', requirePermission(PERMISSIONS.TASKS_UPDATE), taskCtrl.addComment);
router.post('/:id/subtasks', requirePermission(PERMISSIONS.TASKS_UPDATE), taskCtrl.addSubtask);
router.post('/:id/log-time', requirePermission(PERMISSIONS.TASKS_UPDATE), taskCtrl.logTime);

export default router;
