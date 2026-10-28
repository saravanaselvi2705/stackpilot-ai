import { Router } from 'express';
import { createPresentationRequest, downloadPresentationDeck } from '../controllers/presentationController';

const router = Router();

router.post('/', createPresentationRequest);
router.get('/download', downloadPresentationDeck);

export default router;
