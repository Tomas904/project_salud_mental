const { NotificationSettings } = require('../models');

const getSettings = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  let settings = await NotificationSettings.findOne({
    where: { userId }
  });

  if (!settings) {
    settings = await NotificationSettings.create({ userId });
  }

  res.json(ApiResponse.success(settings));
});

const updateSettings = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;

  let settings = await NotificationSettings.findOne({
    where: { userId }
  });

  if (!settings) {
    settings = await NotificationSettings.create({
      userId,
      ...updates
    });
  } else {
    await settings.update(updates);
  }

  res.json(
    ApiResponse.success(settings, 'Configuración actualizada correctamente')
  );
});

module.exports = { getSettings, updateSettings };