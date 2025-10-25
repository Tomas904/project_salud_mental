const config = require('../config/env');
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert non-ApiError to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Error interno del servidor';
    error = new ApiError(statusCode, message);
  }

  const response = {
    success: false,
    error: {
      code: getErrorCode(error.statusCode),
      message: error.message
    }
  };

  if (error.details) {
    response.error.details = error.details;
  }

  // Log error in development
  if (config.env === 'development') {
    console.error('❌ Error:', error);
    response.error.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
};

const getErrorCode = (statusCode) => {
  const codes = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    429: 'TOO_MANY_REQUESTS',
    500: 'INTERNAL_ERROR'
  };
  return codes[statusCode] || 'UNKNOWN_ERROR';
};

// 404 handler
const notFound = (req, res, next) => {
  next(ApiError.notFound(`Ruta no encontrada: ${req.originalUrl}`));
};

module.exports = { errorHandler, notFound };