class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details = null) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'No autorizado') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Acceso denegado') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Recurso no encontrado') {
    return new ApiError(404, message);
  }

  static conflict(message, details = null) {
    return new ApiError(409, message, details);
  }

  static unprocessableEntity(message, details = null) {
    return new ApiError(422, message, details);
  }

  static internal(message = 'Error interno del servidor') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;