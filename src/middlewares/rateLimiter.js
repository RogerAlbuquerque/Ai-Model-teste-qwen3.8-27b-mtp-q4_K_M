const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // 100 requests per window
  standardHeaders: true,    // Return rate limit info in headers
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

module.exports = limiter;

