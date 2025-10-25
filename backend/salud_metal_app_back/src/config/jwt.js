const jwt = require('jsonwebtoken');
const config = require('./env');

const generateToken = (payload, expiresIn = config.jwt.expire) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

const generateAuthTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email
  };
  
  const accessToken = generateToken(payload, config.jwt.expire);
  const refreshToken = generateToken(payload, config.jwt.refreshExpire);
  
  return { accessToken, refreshToken };
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens
};