const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('./middlewares/rateLimiter');
const itemsRouter = require('./routes/items.routes');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/errorHandler').notFoundHandler;

const app = express();

// ─── Security Headers (CSP, X-Frame-Options, etc.) ───
app.use(helmet());

// ─── CORS (restrict in production to specific origins) ───
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// ─── Body Parsing (limit payload to 10kb to prevent abuse) ───
app.use(express.json({ limit: '10kb' }));

// ─── Rate Limiting ───
app.use(rateLimiter);

// ─── Routes ───
app.use('/api/items', itemsRouter);

// ─── 404 Handler (must come after routes) ───
app.use(notFoundHandler);

// ─── Centralized Error Handler (must be last) ───
app.use(errorHandler);

module.exports = app;

