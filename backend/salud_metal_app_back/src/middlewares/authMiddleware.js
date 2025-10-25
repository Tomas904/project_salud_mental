const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Get user
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Usuario no encontrado o inactivo');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(ApiError.unauthorized('Token inválido'));
    } else if (error.name === 'TokenExpiredError') {
      next(ApiError.unauthorized('Token expirado'));
    } else {
      next(error);
    }
  }
};

module.exports = { authenticate };