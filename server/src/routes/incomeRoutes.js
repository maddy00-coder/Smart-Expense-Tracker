import express from 'express';
import { createExpense, deleteExpense, getExpenses, updateExpense } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { expenseQuerySchema, expenseSchema } from '../validations/expenseValidation.js';

const router = express.Router();

router.use(protect);

router.use((req, _res, next) => {
  if (req.method === 'GET') {
    req.query.type = 'income';
  } else if (req.body) {
    req.body.type = 'income';
  }
  next();
});

router.get('/', validateRequest(expenseQuerySchema, 'query'), getExpenses);
router.post('/', validateRequest(expenseSchema), createExpense);
router.put('/:id', validateRequest(expenseSchema), updateExpense);
router.delete('/:id', deleteExpense);

export default router;
