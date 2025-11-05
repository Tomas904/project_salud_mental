const { Emotion } = require('../models');
const { Op } = require('sequelize');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getWeekDates, getDayName, isFutureDate } = require('../utils/dateHelpers');

const createEmotion = asyncHandler(async (req, res) => {
  const { emotionType, intensity, note, date } = req.body;
  const userId = req.user.id;

  // Check if emotion already exists for this date
  const existingEmotion = await Emotion.findOne({
    where: { userId, date }
  });

  if (existingEmotion) {
    throw ApiError.conflict('Ya existe una emoción registrada para este día');
  }

  // Check if date is not in the future
  if (isFutureDate(date)) {
    throw ApiError.badRequest('No puedes registrar emociones para fechas futuras');
  }

  // Create emotion
  const emotion = await Emotion.create({
    userId,
    emotionType,
    intensity,
    note,
    date
  });

  res.status(201).json(
    ApiResponse.success(emotion)
  );
});

const getEmotions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate, limit = 30, page = 1 } = req.query;

  const where = { userId };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date[Op.gte] = startDate;
    if (endDate) where.date[Op.lte] = endDate;
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Emotion.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order: [['date', 'DESC']]
  });

  res.json(
    ApiResponse.success({
      emotions: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    })
  );
});

const getWeeklyEmotions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const weekDates = getWeekDates();

  const emotions = await Emotion.findAll({
    where: {
      userId,
      date: { [Op.in]: weekDates }
    },
    order: [['date', 'ASC']]
  });

  // Create weekly data
  const weeklyData = weekDates.map(date => {
    const emotion = emotions.find(e => e.date === date);
    return {
      day: getDayName(date),
      date,
      emotionType: emotion?.emotionType || null,
      intensity: emotion?.intensity || 0,
      positive: emotion ? calculatePositiveScore(emotion.emotionType, emotion.intensity) : 0,
      negative: emotion ? calculateNegativeScore(emotion.emotionType, emotion.intensity) : 0
    };
  });

  // Calculate summary
  const registeredDays = emotions.length;
  const avgPositive = weeklyData.reduce((sum, day) => sum + day.positive, 0) / registeredDays || 0;
  const avgNegative = weeklyData.reduce((sum, day) => sum + day.negative, 0) / registeredDays || 0;

  res.json(
    ApiResponse.success({
      emotions: weeklyData,
      summary: {
        totalDays: 7,
        registeredDays,
        averagePositive: Math.round(avgPositive * 10) / 10,
        averageNegative: Math.round(avgNegative * 10) / 10,
        mostFrequent: getMostFrequentEmotion(emotions)
      }
    })
  );
});

const getEmotionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const emotion = await Emotion.findOne({
    where: { id, userId }
  });

  if (!emotion) {
    throw ApiError.notFound('Emoción no encontrada');
  }

  res.json(ApiResponse.success(emotion));
});

const updateEmotion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { emotionType, intensity, note } = req.body;

  const emotion = await Emotion.findOne({
    where: { id, userId }
  });

  if (!emotion) {
    throw ApiError.notFound('Emoción no encontrada');
  }

  await emotion.update({
    emotionType: emotionType || emotion.emotionType,
    intensity: intensity || emotion.intensity,
    note: note !== undefined ? note : emotion.note
  });

  res.json(ApiResponse.success(emotion));
});

const deleteEmotion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const emotion = await Emotion.findOne({
    where: { id, userId }
  });

  if (!emotion) {
    throw ApiError.notFound('Emoción no encontrada');
  }

  await emotion.destroy();

  res.json(ApiResponse.success(null, 'Emoción eliminada correctamente'));
});

// Helper functions
const calculatePositiveScore = (emotionType, intensity) => {
  // Regla: solo cuentan como positivas las emociones positivas; el resto no suma
  const positiveEmotions = ['feliz', 'tranquilo'];
  if (positiveEmotions.includes(emotionType)) return intensity;
  return 0;
};

const calculateNegativeScore = (emotionType, intensity) => {
  // Regla: solo cuentan como negativas las emociones negativas; el resto no suma
  const negativeEmotions = ['triste', 'molesto', 'ansioso'];
  if (negativeEmotions.includes(emotionType)) return intensity;
  return 0;
};

const getMostFrequentEmotion = (emotions) => {
  if (emotions.length === 0) return null;
  
  const frequency = {};
  emotions.forEach(e => {
    frequency[e.emotionType] = (frequency[e.emotionType] || 0) + 1;
  });
  
  return Object.keys(frequency).reduce((a, b) => 
    frequency[a] > frequency[b] ? a : b
  );
};

module.exports = {
  createEmotion,
  getEmotions,
  getWeeklyEmotions,
  getEmotionById,
  updateEmotion,
  deleteEmotion
};