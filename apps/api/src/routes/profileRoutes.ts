import { Router } from 'express';
import * as profileCtrl from '../controllers/profileController';
import { authenticateJWT } from '../middleware/auth';
import { uploadAvatar } from '../middleware/upload';

const router = Router();

router.use(authenticateJWT);

router.get('/', profileCtrl.getProfile);
router.put('/', profileCtrl.updateProfile);
router.post('/avatar', uploadAvatar.single('avatar'), profileCtrl.uploadAvatarHandler);
router.post('/2fa', profileCtrl.toggle2FA);
router.get('/history', profileCtrl.getLoginHistory);

export default router;
