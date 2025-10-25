const { body } = require('express-validator');

const VALID_EMOTION_TYPES = ['feliz', 'tranquilo', 'neutral', 'triste', 'molesto', 'ansioso'];

const createEmotionValidation = [
  body('emotionType')
    .isIn(VALID_EMOTION_TYPES)
    .withMessage(`El tipo de emoción debe ser uno de: ${VALID_EMOTION_TYPES.join(', ')}`),
  body('intensity')
    .isInt({ min: 1, max: 10 })
    .withMessage('La intensidad debe ser un número entre 1 y 10'),
  body('note')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La nota no puede exceder 500 caracteres'),
  body('date')
    .isDate()
    .withMessage('Fecha inválida')
];

module.exports = {
  createEmotionValidation
};