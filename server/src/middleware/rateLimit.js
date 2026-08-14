const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: { code: 'RATE_LIMITED', message: 'Too many requests', details: null },
    meta: null,
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: { code: 'RATE_LIMITED', message: 'Too many authentication attempts', details: null },
    meta: null,
  },
});

module.exports = { generalLimiter, authLimiter };
