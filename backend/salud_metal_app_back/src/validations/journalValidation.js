const { body } = require('express-validator');

const createJournalValidation = [
  body('title')
    .optional()
    .isLength({ max: 200 })
    .withMessage('El título no puede exceder 200 caracteres'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('El contenido es requerido')
    .isLength({ max: 5000 })
    .withMessage('El contenido no puede exceder 5000 caracteres'),
  body('mood')
    .optional()
    .isLength({ max: 50 })
    .withMessage('El mood no puede exceder 50 caracteres'),
  body('date')
    .isDate()
    .withMessage('Fecha inválida')
];

module.exports = {
  createJournalValidation
};