import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().max(50).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  role: Joi.string()
    .valid("user", "agent", "admin", "buyer", "seller")
    .default("user"),
  isActive: Joi.boolean().optional(),
  agentDetails: Joi.object({
    companyName: Joi.string().allow("").optional(),
    licenseNumber: Joi.string().allow("").optional(),
    commissionRate: Joi.number().optional(),
    specialization: Joi.string().optional(),
  }).optional(),
  permissions: Joi.object({
    canBid: Joi.boolean().optional(),
    canListProperties: Joi.boolean().optional(),
    emailNotifications: Joi.boolean().optional(),
    smsAlerts: Joi.boolean().optional(),
  }).optional(),
  address: Joi.object({
    street: Joi.string().optional().allow(""),
    city: Joi.string().optional().allow(""),
    postcode: Joi.string().optional().allow(""),
    country: Joi.string().optional().allow(""),
  }).optional(),
  marketingOptOut: Joi.boolean().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});
