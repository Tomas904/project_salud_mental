const asyncHandler = require('../utils/asyncHandler');
const { Tip, FavoriteTip } = require('../models');

const getTips = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { category, limit = 20 } = req.query;

  const where = { isActive: true };
  if (category) where.category = category;

  const tips = await Tip.findAll({
    where,
    limit: parseInt(limit),
    order: [['createdAt', 'DESC']]
  });

  const favoriteTips = await FavoriteTip.findAll({
    where: { userId },
    attributes: ['tipId']
  });

  const favoriteTipIds = favoriteTips.map(ft => ft.tipId);

  const tipsWithFavorite = tips.map(tip => ({
    ...tip.toJSON(),
    isFavorite: favoriteTipIds.includes(tip.id)
  }));

  res.json(ApiResponse.success({ tips: tipsWithFavorite }));
});

const getFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const favorites = await FavoriteTip.findAll({
    where: { userId },
    include: [{ model: Tip, as: 'tip' }],
    order: [['createdAt', 'DESC']]
  });

  res.json(ApiResponse.success({ favorites }));
});

const addFavorite = asyncHandler(async (req, res) => {
  const { tipId } = req.params;
  const userId = req.user.id;

  const tip = await Tip.findByPk(tipId);
  if (!tip) {
    throw ApiError.notFound('Consejo no encontrado');
  }

  const existing = await FavoriteTip.findOne({
    where: { userId, tipId }
  });

  if (existing) {
    throw ApiError.badRequest('Este consejo ya está en favoritos');
  }

  const favorite = await FavoriteTip.create({
    userId,
    tipId
  });

  res.status(201).json(
    ApiResponse.success(favorite, 'Consejo agregado a favoritos')
  );
});

const removeFavorite = asyncHandler(async (req, res) => {
  const { tipId } = req.params;
  const userId = req.user.id;

  const favorite = await FavoriteTip.findOne({
    where: { userId, tipId }
  });

  if (!favorite) {
    throw ApiError.notFound('Favorito no encontrado');
  }

  await favorite.destroy();

  res.json(ApiResponse.success(null, 'Consejo eliminado de favoritos'));
});

module.exports = { getTips, getFavorites, addFavorite, removeFavorite };
