const { getMedalInfo } = require('../utils/medalHelper');

const getMyMedals = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const medals = await Medal.findAll({
    where: { userId },
    include: [{ 
      model: Challenge, 
      as: 'challenge',
      attributes: ['id', 'title']
    }],
    order: [['earnedAt', 'DESC']]
  });

  const summary = {
    total: medals.length,
    byType: {}
  };

  medals.forEach(medal => {
    summary.byType[medal.medalType] = (summary.byType[medal.medalType] || 0) + 1;
  });

  res.json(ApiResponse.success({ medals, summary }));
});

const getAvailableMedals = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const userMedals = await Medal.findAll({
    where: { userId },
    attributes: ['medalType', 'earnedAt']
  });

  const allMedalTypes = [
    'primera_semana',
    'siete_dias_seguidos',
    'mes_completo',
    'maestro_bienestar'
  ];

  const medals = allMedalTypes.map(type => {
    const userMedal = userMedals.find(m => m.medalType === type);
    const info = getMedalInfo(type);
    
    return {
      medalType: type,
      name: info.name,
      description: info.description,
      icon: info.icon,
      isUnlocked: !!userMedal,
      earnedAt: userMedal?.earnedAt || null
    };
  });

  res.json(ApiResponse.success({ medals }));
});

module.exports = { getMyMedals, getAvailableMedals };