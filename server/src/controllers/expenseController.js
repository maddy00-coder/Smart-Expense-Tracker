import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { categorizeExpense } from '../utils/categorizeExpense.js';
import { getMonthBounds, getPreviousMonthBounds, monthKey } from '../utils/date.js';
import { buildExpenseInsights, predictNextMonthExpense } from '../services/expenseInsightsService.js';

function sortMonthlySeries(series) {
  return [...series].sort((left, right) => new Date(`1 ${left.month}`) - new Date(`1 ${right.month}`));
}

const expenseTypeQuery = { $or: [{ type: 'expense' }, { type: { $exists: false } }] };

function getTransactionType(value) {
  return value === 'income' ? 'income' : 'expense';
}

function applyTransactionTypeFilter(query, type) {
  if (!type || type === 'All') {
    return;
  }

  const normalizedType = String(type).toLowerCase();

  if (normalizedType === 'income') {
    query.type = 'income';
    return;
  }

  if (normalizedType === 'expense') {
    Object.assign(query, expenseTypeQuery);
  }
}

function sumAmounts(items) {
  return items.reduce((total, item) => total + item.amount, 0);
}

export const createExpense = asyncHandler(async (req, res) => {
  const type = getTransactionType(req.body.type);
  const normalizedCategory =
    type === 'income' ? req.body.category || 'Other' : categorizeExpense(req.body.description, req.body.category || 'Other');

  const expense = await Expense.create({
    user: req.user._id,
    type,
    amount: req.body.amount,
    category: normalizedCategory,
    date: req.body.date,
    description: req.body.description
  });

  res.status(201).json({ expense });
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    const error = new Error('Expense not found');
    error.statusCode = 404;
    throw error;
  }

  const type = getTransactionType(req.body.type);
  expense.amount = req.body.amount;
  expense.type = type;
  expense.category =
    type === 'income' ? req.body.category || expense.category : categorizeExpense(req.body.description, req.body.category || expense.category);
  expense.date = req.body.date;
  expense.description = req.body.description;

  await expense.save();

  res.json({ expense });
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    const error = new Error('Expense not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({ message: 'Expense deleted' });
});

export const getExpenses = asyncHandler(async (req, res) => {
  const { search, type, category, startDate, endDate, page, limit } = req.query;
  const query = { user: req.user._id };

  applyTransactionTypeFilter(query, type);

  if (category && category !== 'All') {
    query.category = category;
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = new Date(startDate);
    }
    if (endDate) {
      query.date.$lte = new Date(endDate);
    }
  }

  if (search) {
    query.description = { $regex: search, $options: 'i' };
  }

  const skip = (page - 1) * limit;

  const [expenses, total] = await Promise.all([
    Expense.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Expense.countDocuments(query)
  ]);

  res.json({
    expenses,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const { start: monthStart, end: monthEnd } = getMonthBounds(now);
  const { start: previousMonthStart, end: previousMonthEnd } = getPreviousMonthBounds(now);

  const [allTransactions, allExpenses, allIncome, thisMonthExpenses, previousMonthExpenses, recentTransactions, budget, insights, prediction] =
    await Promise.all([
      Expense.find({ user: req.user._id }).lean(),
      Expense.find({ user: req.user._id, ...expenseTypeQuery }).lean(),
      Expense.find({ user: req.user._id, type: 'income' }).lean(),
      Expense.find({ user: req.user._id, ...expenseTypeQuery, date: { $gte: monthStart, $lt: monthEnd } }).lean(),
      Expense.find({ user: req.user._id, ...expenseTypeQuery, date: { $gte: previousMonthStart, $lt: previousMonthEnd } }).lean(),
      Expense.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 }).limit(6).lean(),
      Budget.findOne({ user: req.user._id, month: monthKey(now) }).lean(),
      buildExpenseInsights(req.user._id),
      predictNextMonthExpense(req.user._id)
    ]);

  const totalSpent = sumAmounts(allExpenses);
  const totalIncome = sumAmounts(allIncome);
  const thisMonthTotal = sumAmounts(thisMonthExpenses);
  const previousMonthTotal = sumAmounts(previousMonthExpenses);
  const balance = totalIncome - totalSpent;

  const categoryBreakdown = Object.entries(
    thisMonthExpenses.reduce((accumulator, expense) => {
      accumulator[expense.category] = (accumulator[expense.category] || 0) + expense.amount;
      return accumulator;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const monthlyMap = allExpenses.reduce((accumulator, expense) => {
    const date = new Date(expense.date);
    const key = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
    accumulator[key] = (accumulator[key] || 0) + expense.amount;
    return accumulator;
  }, {});

  const monthlyTrend = sortMonthlySeries(Object.entries(monthlyMap).map(([month, total]) => ({ month, total }))).slice(
    -6
  );

  const comparison =
    previousMonthTotal > 0 ? Math.round(((thisMonthTotal - previousMonthTotal) / previousMonthTotal) * 100) : 0;

  res.json({
    metrics: {
      totalBalance: balance,
      totalIncome,
      totalExpenses: totalSpent,
      thisMonthExpenses: thisMonthTotal,
      previousMonthExpenses: previousMonthTotal,
      totalTransactions: allTransactions.length,
      comparison
    },
    recentExpenses: recentTransactions,
    categoryBreakdown,
    monthlyTrend,
    budget: budget
      ? {
          ...budget,
          spent: thisMonthTotal,
          utilization: budget.amount ? (thisMonthTotal / budget.amount) * 100 : 0
        }
      : null,
    insights,
    prediction
  });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const transactions = await Expense.find({ user: req.user._id }).sort({ date: 1 }).lean();
  const monthlyExpenses = {};
  const monthlyIncome = {};
  const categories = {};
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((transaction) => {
    const type = transaction.type || 'expense';
    const date = new Date(transaction.date);
    const month = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;

    if (type === 'income') {
      monthlyIncome[month] = (monthlyIncome[month] || 0) + transaction.amount;
      totalIncome += transaction.amount;
      return;
    }

    monthlyExpenses[month] = (monthlyExpenses[month] || 0) + transaction.amount;
    categories[transaction.category] = (categories[transaction.category] || 0) + transaction.amount;
    totalExpenses += transaction.amount;
  });

  res.json({
    monthlyTrend: sortMonthlySeries(Object.entries(monthlyExpenses).map(([month, total]) => ({ month, total }))),
    incomeTrend: sortMonthlySeries(Object.entries(monthlyIncome).map(([month, total]) => ({ month, total }))),
    categoryDistribution: Object.entries(categories).map(([name, value]) => ({ name, value })),
    totals: {
      income: totalIncome,
      expenses: totalExpenses,
      balance: totalIncome - totalExpenses
    }
  });
});
