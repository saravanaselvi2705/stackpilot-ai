import { Router } from 'express';
import * as aiCtrl from '../controllers/aiController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.post('/chat', aiCtrl.aiChatAssistant);
router.get('/prompts', aiCtrl.getPromptLibrary);
router.post('/meeting-minutes', aiCtrl.aiGenerateMeetingMinutes);

export default router;
