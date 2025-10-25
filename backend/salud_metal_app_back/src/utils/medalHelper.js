const { Medal, UserChallenge, Emotion } = require('../models');
const { Op } = require('sequelize');

const MEDAL_TYPES = {
  PRIMERA_SEMANA: 'primera_semana',
  SIETE_DIAS_SEGUIDOS: 'siete_dias_seguidos',
  MES_COMPLETO: 'mes_completo',
  MAESTRO_BIENESTAR: 'maestro_bienestar',
  ESCRITOR_FRECUENTE: 'escritor_frecuente',
  MEDITADOR_CONSTANTE: 'meditador_constante'
};

const checkAndAwardMedals = async (userId) => {
  const medals = [];

  // Check Primera Semana
  const firstChallenge = await UserChallenge.findOne({
    where: { userId, isCompleted: true }
  });

  if (firstChallenge) {
    const hasMedal = await Medal.findOne({
      where: { userId, medalType: MEDAL_TYPES.PRIMERA_SEMANA }
    });

    if (!hasMedal) {
      const medal = await Medal.create({
        userId,
        medalType: MEDAL_TYPES.PRIMERA_SEMANA,
        challengeId: firstChallenge.challengeId
      });
      medals.push(medal);
    }
  }

  // Check Maestro Bienestar (10 retos completados)
  const completedChallenges = await UserChallenge.count({
    where: { userId, isCompleted: true }
  });

  if (completedChallenges >= 10) {
    const hasMedal = await Medal.findOne({
      where: { userId, medalType: MEDAL_TYPES.MAESTRO_BIENESTAR }
    });

    if (!hasMedal) {
      const medal = await Medal.create({
        userId,
        medalType: MEDAL_TYPES.MAESTRO_BIENESTAR
      });
      medals.push(medal);
    }
  }

  // Check 7 días seguidos (emociones registradas)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const recentEmotions = await Emotion.findAll({
    where: {
      userId,
      date: {
        [Op.gte]: sevenDaysAgo.toISOString().split('T')[0]
      }
    },
    order: [['date', 'ASC']]
  });

  if (recentEmotions.length === 7) {
    const hasMedal = await Medal.findOne({
      where: { userId, medalType: MEDAL_TYPES.SIETE_DIAS_SEGUIDOS }
    });

    if (!hasMedal) {
      const medal = await Medal.create({
        userId,
        medalType: MEDAL_TYPES.SIETE_DIAS_SEGUIDOS
      });
      medals.push(medal);
    }
  }

  return medals;
};

const getMedalInfo = (medalType) => {
  const medals = {
    [MEDAL_TYPES.PRIMERA_SEMANA]: {
      name: 'Primera Semana',
      description: 'Completa tu primer reto de 7 días',
      icon: '🥇'
    },
    [MEDAL_TYPES.SIETE_DIAS_SEGUIDOS]: {
      name: '7 Días Seguidos',
      description: 'Registra emociones 7 días consecutivos',
      icon: '🔥'
    },
    [MEDAL_TYPES.MES_COMPLETO]: {
      name: 'Mes Completo',
      description: 'Mantén actividad durante 30 días',
      icon: '💪'
    },
    [MEDAL_TYPES.MAESTRO_BIENESTAR]: {
      name: 'Maestro del Bienestar',
      description: 'Completa 10 retos diferentes',
      icon: '👑'
    },
    [MEDAL_TYPES.ESCRITOR_FRECUENTE]: {
      name: 'Escritor Frecuente',
      description: '50 entradas de diario',
      icon: '✍️'
    },
    [MEDAL_TYPES.MEDITADOR_CONSTANTE]: {
      name: 'Meditador Constante',
      description: '30 sesiones de meditación',
      icon: '🧘'
    }
  };

  return medals[medalType] || null;
};

module.exports = {
  MEDAL_TYPES,
  checkAndAwardMedals,
  getMedalInfo
};