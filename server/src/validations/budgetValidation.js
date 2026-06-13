import Joi from 'joi';

export const budgetSchema = Joi.object({
  amount: Joi.number().positive().required(),
  month: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .required()
});
