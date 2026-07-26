import { Router } from 'express';
import * as calCtrl from '../controllers/calendarController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/events', calCtrl.getCalendarEvents);

export default router;
