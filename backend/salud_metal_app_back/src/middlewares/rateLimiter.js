const rateLimit = require('express-rate-limit');
const config = require('../config/env');

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Demasiadas peticiones, intenta de nuevo más tarde'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 9000, // 5 attempts
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Demasiados intentos de login, intenta de nuevo en 15 minutos'
    }
  }
});

module.exports = { limiter, authLimiter };