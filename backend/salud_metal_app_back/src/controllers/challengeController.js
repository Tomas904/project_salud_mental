const { Challenge, UserChallenge, Medal } = require('../models');
const { checkAndAwardMedals } = require('../utils/medalHelper');

const getChallenges = asyncHandler(async (req, res) => {
  const { type, isActive } = req.query;
  const where = {};

  if (type) where.type = type;
  if (isActive !== undefined) where.isActive = isActive === 'true';

  const challenges = await Challenge.findAll({
    where,
    order: [['createdAt', 'DESC']]
  });

  res.json(ApiResponse.success({ challenges }));
});

const startChallenge = asyncHandler(async (req, res) => {
  const { challengeId } = req.params;
  const userId = req.user.id;

  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) {
    throw ApiError.notFound('Reto no encontrado');
  }

  const existingChallenge = await UserChallenge.findOne({
    where: { userId, challengeId, isCompleted: false }
  });

  if (existingChallenge) {
    throw ApiError.badRequest('Ya tienes este reto activo');
  }

  const userChallenge = await UserChallenge.create({
    userId,
    challengeId
  });

  const result = await UserChallenge.findByPk(userChallenge.id, {
    include: [{ model: Challenge, as: 'challenge' }]
  });

  res.status(201).json(ApiResponse.success(result));
});

const getMyChallenges = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status = 'active' } = req.query;

  const where = { userId };
  if (status === 'active') where.isCompleted = false;
  if (status === 'completed') where.isCompleted = true;

  const challenges = await UserChallenge.findAll({
    where,
    include: [{ model: Challenge, as: 'challenge' }],
    order: [['startedAt', 'DESC']]
  });

  res.json(ApiResponse.success({ challenges }));
});

const completeDay = asyncHandler(async (req, res) => {
  const { userChallengeId } = req.params;
  const { date } = req.body;
  const userId = req.user.id;

  const userChallenge = await UserChallenge.findOne({
    where: { id: userChallengeId, userId },
    include: [{ model: Challenge, as: 'challenge' }]
  });

  if (!userChallenge) {
    throw ApiError.notFound('Reto no encontrado');
  }

  if (userChallenge.isCompleted) {
    throw ApiError.badRequest('Este reto ya está completado');
  }

  const completedDays = userChallenge.completedDays || [];
  
  if (completedDays.includes(date)) {
    throw ApiError.badRequest('Ya completaste este día');
  }

  completedDays.push(date);
  const currentDay = userChallenge.currentDay + 1;
  const progress = Math.round((completedDays.length / userChallenge.challenge.durationDays) * 100);
  const isCompleted = completedDays.length >= userChallenge.challenge.durationDays;

  await userChallenge.update({
    completedDays,
    currentDay,
    progress,
    isCompleted,
    completedAt: isCompleted ? new Date() : null
  });

  let message = '¡Día completado! Sigue así 🎉';
  let awardedMedals = [];

  if (isCompleted) {
    message = '¡Reto completado! 🏆';
    awardedMedals = await checkAndAwardMedals(userId);
  }

  const response = {
    id: userChallenge.id,
    progress: userChallenge.progress,
    currentDay: userChallenge.currentDay,
    completedDays: userChallenge.completedDays,
    isCompleted: userChallenge.isCompleted,
    daysRemaining: userChallenge.challenge.durationDays - completedDays.length
  };

  if (isCompleted) {
    response.completedAt = userChallenge.completedAt;
    if (awardedMedals.length > 0) {
      response.medal = awardedMedals[0];
      message = '¡Reto completado! 🏆 Has ganado una medalla';
    }
  }

  res.json(ApiResponse.success(response, message));
});

const abandonChallenge = asyncHandler(async (req, res) => {
  const { userChallengeId } = req.params;
  const userId = req.user.id;

  const userChallenge = await UserChallenge.findOne({
    where: { id: userChallengeId, userId }
  });

  if (!userChallenge) {
    throw ApiError.notFound('Reto no encontrado');
  }

  await userChallenge.destroy();

  res.json(ApiResponse.success(null, 'Reto abandonado'));
});

module.exports = { getChallenges, startChallenge, getMyChallenges, completeDay, abandonChallenge };