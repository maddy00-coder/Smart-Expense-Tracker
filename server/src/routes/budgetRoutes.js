import express from 'express';
import { getCurrentBudget, upsertBudget } from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { budgetSchema } from '../validations/budgetValidation.js';

const router = express.Router();

router.use(protect);

router.get('/', getCurrentBudget);
router.post('/', validateRequest(budgetSchema), upsertBudget);

export default router;
