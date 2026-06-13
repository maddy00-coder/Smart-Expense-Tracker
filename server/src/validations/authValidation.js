import Joi from 'joi';

const emailValidationMessage = 'Please enter a valid email address.';
const requiredFieldsMessage = 'Please fill all required fields.';
const emailSchema = Joi.string().trim().lowercase().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/).required().messages({
  'string.empty': requiredFieldsMessage,
  'string.pattern.base': emailValidationMessage,
  'any.required': requiredFieldsMessage
});

export const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required().messages({
    'string.empty': requiredFieldsMessage,
    'string.min': requiredFieldsMessage,
    'any.required': requiredFieldsMessage
  }),
  email: emailSchema,
  password: Joi.string().min(6).max(128).required().messages({
    'string.empty': requiredFieldsMessage,
    'string.min': 'Password must be at least 6 characters long.',
    'any.required': requiredFieldsMessage
  })
});

export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    'string.empty': requiredFieldsMessage,
    'any.required': requiredFieldsMessage
  })
});
