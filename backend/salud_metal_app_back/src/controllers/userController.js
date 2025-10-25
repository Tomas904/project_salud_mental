const { User } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getMe = asyncHandler(async (req, res) => {
  res.json(ApiResponse.success(req.user.toJSON()));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatarUrl, timezone, language } = req.body;
  const user = req.user;

  await user.update({
    name: name || user.name,
    avatarUrl: avatarUrl !== undefined ? avatarUrl : user.avatarUrl,
    timezone: timezone || user.timezone,
    language: language || user.language
  });

  res.json(ApiResponse.success(user.toJSON()));
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  const isValidPassword = await user.comparePassword(currentPassword);
  if (!isValidPassword) {
    throw ApiError.unauthorized('Contraseña actual incorrecta');
  }

  await user.update({ password: newPassword });

  res.json(ApiResponse.success(null, 'Contraseña actualizada correctamente'));
});

const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = req.user;

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw ApiError.unauthorized('Contraseña incorrecta');
  }

  await user.destroy();

  res.json(ApiResponse.success(null, 'Cuenta eliminada correctamente'));
});

module.exports = { getMe, updateProfile, changePassword, deleteAccount };