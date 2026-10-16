/**
 * 404 Handler — catches unmatched routes.
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`
  });
}

/**
 * Centralized error handler.
 * Catches all errors thrown in async handlers / next(err).
 * Prevents leaking internal details in production.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';

  const statusCode = err.statusCode || 500;
  const message = isProduction
    ? 'An internal server error occurred'
    : err.message;

  // Build response
  const body = {
    error: err.name === 'ValidationError' ? 'Validation Error' : 
'Error',
    message
  };

  // Include validation details only in non-prod (or always for 400s)
  if (err.details && statusCode === 400) {
    body.details = err.details;
  }

  // Log server-side (never send stack trace to client)
  if (statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.url} →`, err.stack || 
err);
  }

  res.status(statusCode).json(body);
}

module.exports = errorHandler;
module.exports.notFoundHandler = notFoundHandler;

