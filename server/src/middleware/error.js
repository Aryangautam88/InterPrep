const { sendError, AppError } = require('../utils/apiResponse');

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'CastError') {
    return sendError(res, new AppError('Invalid identifier', 400, 'VALIDATION_ERROR'));
  }
  if (err.code === 11000) {
    return sendError(res, new AppError('Resource already exists', 409, 'CONFLICT'));
  }
  if (err.name === 'ValidationError') {
    return sendError(res, new AppError(err.message, 400, 'VALIDATION_ERROR'));
  }

  if (!err.isOperational) {
    console.error(err);
  }

  return sendError(res, err);
}

module.exports = { notFound, errorHandler };
