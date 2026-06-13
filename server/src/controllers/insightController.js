import { asyncHandler } from '../utils/asyncHandler.js';
import { buildExpenseInsights, predictNextMonthExpense } from '../services/expenseInsightsService.js';

export const getInsights = asyncHandler(async (req, res) => {
  const [insights, prediction] = await Promise.all([
    buildExpenseInsights(req.user._id),
    predictNextMonthExpense(req.user._id)
  ]);

  res.json({
    insights,
    prediction
  });
});
