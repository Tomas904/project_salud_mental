const { Exercise, UserExercise } = require('../models');

const getExercises = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const where = { isActive: true };

  if (type) where.type = type;

  const exercises = await Exercise.findAll({
    where,
    order: [['createdAt', 'ASC']]
  });

  res.json(ApiResponse.success({ exercises }));
});

const getExerciseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const exercise = await Exercise.findByPk(id);
  if (!exercise) {
    throw ApiError.notFound('Ejercicio no encontrado');
  }

  const completedCount = await UserExercise.count({
    where: { userId, exerciseId: id }
  });

  const lastCompleted = await UserExercise.findOne({
    where: { userId, exerciseId: id },
    order: [['completedAt', 'DESC']]
  });

  res.json(ApiResponse.success({
    ...exercise.toJSON(),
    completedCount,
    lastCompleted: lastCompleted?.completedAt || null
  }));
});

const completeExercise = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { durationMinutes, rating } = req.body;

  const exercise = await Exercise.findByPk(id);
  if (!exercise) {
    throw ApiError.notFound('Ejercicio no encontrado');
  }

  const userExercise = await UserExercise.create({
    userId,
    exerciseId: id,
    durationMinutes,
    rating
  });

  res.status(201).json(
    ApiResponse.success(userExercise, '¡Ejercicio completado! 🎉')
  );
});

const getHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { limit = 20, page = 1 } = req.query;

  const offset = (page - 1) * limit;

  const { count, rows } = await UserExercise.findAndCountAll({
    where: { userId },
    include: [{ 
      model: Exercise, 
      as: 'exercise',
      attributes: ['id', 'title', 'type', 'icon']
    }],
    limit: parseInt(limit),
    offset,
    order: [['completedAt', 'DESC']]
  });

  res.json(ApiResponse.success({
    history: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    }
  }));
});

module.exports = { getExercises, getExerciseById, completeExercise, getHistory };
