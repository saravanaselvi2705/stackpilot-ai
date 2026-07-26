import { Router } from 'express';
import { getHealthCheck } from '../controllers/healthController';

const router = Router();

// Unauthenticated health check endpoint
router.get('/', getHealthCheck);

export default router;
