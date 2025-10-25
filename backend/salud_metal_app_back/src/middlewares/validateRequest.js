const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const details = {};
    errors.array().forEach(error => {
      details[error.path] = error.msg;
    });
    
    throw ApiError.unprocessableEntity('Error de validación', details);
  }
  
  next();
};

module.exports = validateRequest;