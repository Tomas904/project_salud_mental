const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { Op } = require('sequelize');
const { Emotion, UserChallenge, Medal, JournalEntry, UserExercise } = require('../models');
const { getWeekDates, getMonthDates, getDayName } = require('../utils/dateHelpers');

const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Emotional Status
  const emotions = await Emotion.findAll({
    where: { userId },
    limit: 30,
    order: [['date', 'DESC']]
  });

  const positiveCount = emotions.filter(e => 
    ['feliz', 'tranquilo'].includes(e.emotionType)
  ).length;
  const neutralCount = emotions.filter(e => 
    e.emotionType === 'neutral'
  ).length;
  const negativeCount = emotions.filter(e => 
    ['triste', 'molesto', 'ansioso'].includes(e.emotionType)
  ).length;

  const total = emotions.length || 1;
  const emotionalStatus = {
    positive: Math.round((positiveCount / total) * 100),
    neutral: Math.round((neutralCount / total) * 100),
    negative: Math.round((negativeCount / total) * 100)
  };

  // Weekly Progress
  const weekDates = getWeekDates();
  const weekEmotions = await Emotion.findAll({
    where: {
      userId,
      date: { [Op.in]: weekDates }
    }
  });

  const weeklyProgress = {
    emotions: weekDates.map(date => {
      const emotion = weekEmotions.find(e => e.date === date);
      return {
        day: getDayName(date),
        date,
        positive: emotion ? calculatePositiveScore(emotion.emotionType, emotion.intensity) : 0,
        negative: emotion ? calculateNegativeScore(emotion.emotionType, emotion.intensity) : 0
      };
    }),
    average: weekEmotions.reduce((sum, e) => sum + e.intensity, 0) / weekEmotions.length || 0
  };

  // User Stats
  const [completedChallenges, medals, journalEntries, exercises] = await Promise.all([
    UserChallenge.count({ where: { userId, isCompleted: true } }),
    Medal.count({ where: { userId } }),
    JournalEntry.count({ where: { userId } }),
    UserExercise.count({ where: { userId } })
  ]);

  const userStats = {
    activeDays: emotions.length,
    completedChallenges,
    totalMedals: medals,
    journalEntries,
    exercisesCompleted: exercises
  };

  res.json(ApiResponse.success({
    emotionalStatus,
    weeklyProgress,
    userStats,
    currentStreak: 0, // TODO: Calculate streak
    longestStreak: 0  // TODO: Calculate streak
  }));
});

const getMonthly = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;

  const { start, end } = getMonthDates(year, month);

  const emotions = await Emotion.findAll({
    where: {
      userId,
      date: { [Op.between]: [start, end] }
    }
  });

  const byType = {};
  emotions.forEach(e => {
    byType[e.emotionType] = (byType[e.emotionType] || 0) + 1;
  });

  const avgIntensity = emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length || 0;

  const monthName = new Date(year, month - 1).toLocaleString('es', { month: 'long' });

  res.json(ApiResponse.success({
    period: { year, month, monthName },
    emotions: {
      byType,
      total: emotions.length,
      averageIntensity: Math.round(avgIntensity * 10) / 10,
      mostFrequent: getMostFrequentEmotion(emotions)
    },
    activities: {
      journalEntries: await JournalEntry.count({
        where: { userId, date: { [Op.between]: [start, end] } }
      }),
      exercisesCompleted: await UserExercise.count({
        where: {
          userId,
          completedAt: { [Op.between]: [start, end + 'T23:59:59'] }
        }
      }),
      activeDays: emotions.length
    },
    challenges: {
      started: await UserChallenge.count({
        where: {
          userId,
          startedAt: { [Op.between]: [start, end + 'T23:59:59'] }
        }
      }),
      completed: await UserChallenge.count({
        where: {
          userId,
          isCompleted: true,
          completedAt: { [Op.between]: [start, end + 'T23:59:59'] }
        }
      }),
      inProgress: await UserChallenge.count({
        where: { userId, isCompleted: false }
      })
    }
  }));
});

// Helpers locales (mismas reglas que en emotionController)
const calculatePositiveScore = (emotionType, intensity) => {
  // Igual que en emotionController: solo suman las positivas
  const positiveEmotions = ['feliz', 'tranquilo'];
  if (positiveEmotions.includes(emotionType)) return intensity;
  return 0;
};

const calculateNegativeScore = (emotionType, intensity) => {
  // Igual que en emotionController: solo suman las negativas
  const negativeEmotions = ['triste', 'molesto', 'ansioso'];
  if (negativeEmotions.includes(emotionType)) return intensity;
  return 0;
};

const getMostFrequentEmotion = (emotions) => {
  if (!emotions || emotions.length === 0) return null;
  const frequency = {};
  emotions.forEach(e => {
    const key = e.emotionType || e.emotion_type || null;
    if (key) frequency[key] = (frequency[key] || 0) + 1;
  });
  return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b, Object.keys(frequency)[0]);
};

module.exports = { getDashboard, getMonthly };