import Joi from 'joi';
import { categories } from '../utils/constants.js';

export const expenseSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').default('expense'),
  amount: Joi.number().positive().required(),
  category: Joi.string()
    .valid(...categories)
    .optional()
    .allow(''),
  date: Joi.date().required(),
  description: Joi.string().min(2).max(160).required()
});

export const expenseQuerySchema = Joi.object({
  search: Joi.string().allow('', null),
  type: Joi.string().valid('All', 'Income', 'Expense', 'income', 'expense').default('All'),
  category: Joi.string()
    .valid(...categories, 'All')
    .default('All'),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10)
});
