const Joi = require('joi');
const { BRANCHES } = require('../utils/constants');

const password = Joi.string()
  .min(8)
  .max(72)
  .pattern(/[A-Z]/)
  .pattern(/[a-z]/)
  .pattern(/[0-9]/)
  .messages({
    'string.pattern.base': 'Password must include upper, lower, and a number',
    'string.min': 'Password must be at least 8 characters',
  });

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: password.required(),
  branch: Joi.string()
    .valid(...BRANCHES)
    .when('role', {
      is: 'student',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  role: Joi.string().valid('student', 'mentor').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: password.required(),
});

module.exports = { registerSchema, loginSchema, changePasswordSchema };
