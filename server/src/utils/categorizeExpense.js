import { categoryKeywords } from './constants.js';

export function categorizeExpense(description = '', fallbackCategory = 'Other') {
  if (fallbackCategory && fallbackCategory !== 'Other') {
    return fallbackCategory;
  }

  const normalized = description.trim().toLowerCase();

  if (!normalized) {
    return fallbackCategory;
  }

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }

  return fallbackCategory;
}
