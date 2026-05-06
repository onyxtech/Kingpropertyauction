import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().trim().max(50).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  role: Joi.string().valid('user', 'agent', 'admin', 'buyer', 'seller', 'investor').default('user'),
  isActive: Joi.boolean().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});