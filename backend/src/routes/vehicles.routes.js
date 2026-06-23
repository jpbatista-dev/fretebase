import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { findAll, create, update, remove } from '../controllers/vehicles.controller.js';

const router = Router();

router.use(authenticate);

router.get('/',       findAll);
router.post('/',      create);
router.patch('/:id',  update);
router.delete('/:id', remove);

export default router;
