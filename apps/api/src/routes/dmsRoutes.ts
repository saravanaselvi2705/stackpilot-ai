import { Router } from 'express';
import * as dmsCtrl from '../controllers/dmsController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/folders', dmsCtrl.getFolders);
router.post('/folders', dmsCtrl.createFolder);
router.get('/documents', dmsCtrl.getDocuments);
router.post('/documents', dmsCtrl.createDocument);
router.patch('/documents/:id/approval', dmsCtrl.updateDocumentApproval);

export default router;
