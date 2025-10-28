const asyncHandler = require('../utils/asyncHandler');
const globalSearch = asyncHandler(async (req, res) => {
  const { q, type = 'all' } = req.query;
  const userId = req.user.id;

  if (!q) {
    throw ApiError.badRequest('Query de búsqueda requerido');
  }

  const results = {
    tips: [],
    exercises: [],
    challenges: [],
    journalEntries: []
  };

  const searchTerm = `%${q}%`;

  if (type === 'all' || type === 'tips') {
    results.tips = await Tip.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { title: { [Op.iLike]: searchTerm } },
          { description: { [Op.iLike]: searchTerm } }
        ]
      },
      limit: 5
    });
  }

  if (type === 'all' || type === 'exercises') {
    results.exercises = await Exercise.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { title: { [Op.iLike]: searchTerm } },
          { description: { [Op.iLike]: searchTerm } }
        ]
      },
      limit: 5
    });
  }

  if (type === 'all' || type === 'challenges') {
    results.challenges = await Challenge.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { title: { [Op.iLike]: searchTerm } },
          { description: { [Op.iLike]: searchTerm } }
        ]
      },
      limit: 5
    });
  }

  if (type === 'all' || type === 'journal') {
    results.journalEntries = await JournalEntry.findAll({
      where: {
        userId,
        [Op.or]: [
          { title: { [Op.iLike]: searchTerm } },
          { content: { [Op.iLike]: searchTerm } }
        ]
      },
      limit: 5,
      attributes: ['id', 'title', 'content', 'date']
    }).then(entries => entries.map(e => ({
      ...e.toJSON(),
      excerpt: e.content.substring(0, 100) + '...'
    })));
  }

  const total = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

  res.json(ApiResponse.success({
    query: q,
    results,
    total
  }));
});

module.exports = { globalSearch };