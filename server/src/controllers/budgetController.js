import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getMonthBounds, monthKey } from '../utils/date.js';

export const upsertBudget = asyncHandler(async (req, res) => {
  const { amount, month } = req.body;

  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, month },
    { amount },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({ budget });
});

export const getCurrentBudget = asyncHandler(async (req, res) => {
  const month = req.query.month || monthKey(new Date());
  const budget = await Budget.findOne({ user: req.user._id, month }).lean();

  if (!budget) {
    return res.json({
      budget: null,
      spent: 0,
      utilization: 0,
      status: 'safe'
    });
  }

  const [year, monthNumber] = month.split('-').map(Number);
  const monthDate = new Date(year, monthNumber - 1, 1);
  const { start, end } = getMonthBounds(monthDate);
  const expenses = await Expense.find({
    user: req.user._id,
    $or: [{ type: 'expense' }, { type: { $exists: false } }],
    date: { $gte: start, $lt: end }
  }).lean();

  const spent = expenses.reduce((total, expense) => total + expense.amount, 0);
  const utilization = budget.amount ? (spent / budget.amount) * 100 : 0;
  const status = utilization >= 100 ? 'exceeded' : utilization >= 80 ? 'warning' : 'safe';

  res.json({
    budget,
    spent,
    utilization,
    status
  });
});
