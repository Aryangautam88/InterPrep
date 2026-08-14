class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }
}

function sendSuccess(res, data = null, meta = null, status = 200) {
  return res.status(status).json({
    success: true,
    data,
    error: null,
    meta,
  });
}

function sendError(res, err) {
  const status = err.statusCode || 500;
  const payload = {
    success: false,
    data: null,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: status >= 500 && process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message,
      details: err.details || null,
    },
    meta: null,
  };
  return res.status(status).json(payload);
}

module.exports = { AppError, sendSuccess, sendError };
