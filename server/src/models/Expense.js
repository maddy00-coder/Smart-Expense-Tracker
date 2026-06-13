import mongoose from 'mongoose';
import { categories } from '../utils/constants.js';

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      default: 'expense'
    },
    category: {
      type: String,
      enum: categories,
      default: 'Other'
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, type: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ user: 1, description: 'text' });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
