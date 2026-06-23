import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { findAll } from '../controllers/routes.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', findAll);

export default router;
