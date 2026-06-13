import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import { getMonthBounds, getPreviousMonthBounds, monthKey } from '../utils/date.js';

export async function buildExpenseInsights(userId) {
  const now = new Date();
  const { start: monthStart, end: monthEnd } = getMonthBounds(now);
  const { start: prevStart, end: prevEnd } = getPreviousMonthBounds(now);

  const [currentExpenses, previousExpenses, currentBudget] = await Promise.all([
    Expense.find({
      user: userId,
      $or: [{ type: 'expense' }, { type: { $exists: false } }],
      date: { $gte: monthStart, $lt: monthEnd }
    }).lean(),
    Expense.find({
      user: userId,
      $or: [{ type: 'expense' }, { type: { $exists: false } }],
      date: { $gte: prevStart, $lt: prevEnd }
    }).lean(),
    Budget.findOne({ user: userId, month: monthKey(now) }).lean()
  ]);

  const sum = (items) => items.reduce((total, item) => total + item.amount, 0);
  const currentTotal = sum(currentExpenses);
  const previousTotal = sum(previousExpenses);

  const groupByCategory = (items) =>
    items.reduce((accumulator, item) => {
      accumulator[item.category] = (accumulator[item.category] || 0) + item.amount;
      return accumulator;
    }, {});

  const currentByCategory = groupByCategory(currentExpenses);
  const previousByCategory = groupByCategory(previousExpenses);

  const topCategoryEntry = Object.entries(currentByCategory).sort((a, b) => b[1] - a[1])[0];
  const insights = [];

  if (topCategoryEntry) {
    insights.push(`Your highest spending category is ${topCategoryEntry[0]}.`);
  }

  for (const [category, currentAmount] of Object.entries(currentByCategory)) {
    const previousAmount = previousByCategory[category] || 0;
    if (previousAmount > 0) {
      const change = Math.round(((currentAmount - previousAmount) / previousAmount) * 100);
      if (Math.abs(change) >= 10) {
        insights.push(
          `You spent ${Math.abs(change)}% ${change > 0 ? 'more' : 'less'} on ${category} compared to last month.`
        );
      }
    }
  }

  if (currentBudget) {
    const utilization = currentBudget.amount ? (currentTotal / currentBudget.amount) * 100 : 0;
    if (utilization >= 100) {
      insights.push('You have exceeded your monthly budget.');
    } else if (utilization >= 80) {
      insights.push('You are close to exceeding your monthly budget.');
    }
  }

  if (currentTotal > previousTotal && previousTotal > 0) {
    const overallGrowth = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
    insights.push(`Overall spending is up ${overallGrowth}% compared to last month.`);
  }

  return insights.slice(0, 4);
}

export async function predictNextMonthExpense(userId) {
  const now = new Date();
  const monthStarts = [0, 1, 2].map((offset) => new Date(now.getFullYear(), now.getMonth() - offset, 1));

  const monthlyTotals = await Promise.all(
    monthStarts.map(async (start) => {
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      const expenses = await Expense.find({
        user: userId,
        $or: [{ type: 'expense' }, { type: { $exists: false } }],
        date: { $gte: start, $lt: end }
      }).lean();
      return expenses.reduce((total, expense) => total + expense.amount, 0);
    })
  );

  const validTotals = monthlyTotals.filter((value) => value > 0);

  if (!validTotals.length) {
    return 0;
  }

  const prediction = validTotals.reduce((total, value) => total + value, 0) / validTotals.length;
  return Math.round(prediction);
}
