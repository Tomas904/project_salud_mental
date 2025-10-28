const asyncHandler = require('../utils/asyncHandler');
const { JournalEntry } = require('../models');
const { Op } = require('sequelize');

const createEntry = asyncHandler(async (req, res) => {
  const { title, content, mood, date } = req.body;
  const userId = req.user.id;

  const entry = await JournalEntry.create({
    userId,
    title,
    content,
    mood,
    date
  });

  res.status(201).json(ApiResponse.success(entry));
});

const getEntries = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { limit = 20, page = 1, search } = req.query;

  const where = { userId };

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { content: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await JournalEntry.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order: [['date', 'DESC']]
  });

  res.json(ApiResponse.success({
    entries: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    }
  }));
});

const getEntryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const entry = await JournalEntry.findOne({
    where: { id, userId }
  });

  if (!entry) {
    throw ApiError.notFound('Entrada no encontrada');
  }

  res.json(ApiResponse.success(entry));
});

const updateEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, content, mood } = req.body;

  const entry = await JournalEntry.findOne({
    where: { id, userId }
  });

  if (!entry) {
    throw ApiError.notFound('Entrada no encontrada');
  }

  await entry.update({
    title: title !== undefined ? title : entry.title,
    content: content || entry.content,
    mood: mood !== undefined ? mood : entry.mood
  });

  res.json(ApiResponse.success(entry));
});

const deleteEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const entry = await JournalEntry.findOne({
    where: { id, userId }
  });

  if (!entry) {
    throw ApiError.notFound('Entrada no encontrada');
  }

  await entry.destroy();

  res.json(ApiResponse.success(null, 'Entrada eliminada correctamente'));
});

module.exports = { createEntry, getEntries, getEntryById, updateEntry, deleteEntry };