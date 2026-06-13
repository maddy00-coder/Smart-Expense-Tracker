import express from 'express';
import {
  createExpense,
  deleteExpense,
  getAnalytics,
  getDashboard,
  getExpenses,
  updateExpense
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { expenseQuerySchema, expenseSchema } from '../validations/expenseValidation.js';

const router = express.Router();

router.use(protect);

router.get('/', validateRequest(expenseQuerySchema, 'query'), getExpenses);
router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);
router.post('/', validateRequest(expenseSchema), createExpense);
router.put('/:id', validateRequest(expenseSchema), updateExpense);
router.delete('/:id', deleteExpense);

export default router;
