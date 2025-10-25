const { User, NotificationSettings } = require('../models');
const { generateAuthTokens } = require('../config/jwt');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw ApiError.conflict('El email ya está registrado');
  }

  // Create user
  const user = await User.create({
    email,
    password,
    name
  });

  // Create notification settings
  await NotificationSettings.create({ userId: user.id });

  // Generate tokens
  const { accessToken } = generateAuthTokens(user);

  res.status(201).json(
    ApiResponse.success({
      user: user.toJSON(),
      token: accessToken
    })
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Credenciales inválidas');
  }

  // Check password
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw ApiError.unauthorized('Credenciales inválidas');
  }

  // Update last login
  await user.update({ lastLogin: new Date() });

  // Generate tokens
  const { accessToken } = generateAuthTokens(user);

  res.json(
    ApiResponse.success({
      user: user.toJSON(),
      token: accessToken
    })
  );
});

const logout = asyncHandler(async (req, res) => {
  // In a real app, you'd invalidate the token here
  res.json(ApiResponse.success(null, 'Sesión cerrada correctamente'));
});

const refreshToken = asyncHandler(async (req, res) => {
  const user = req.user;
  const { accessToken } = generateAuthTokens(user);

  res.json(
    ApiResponse.success({ token: accessToken })
  );
});

module.exports = {
  register,
  login,
  logout,
  refreshToken
};