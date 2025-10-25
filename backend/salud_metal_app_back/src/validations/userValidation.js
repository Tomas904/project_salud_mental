const { body } = require('express-validator');

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('avatarUrl')
    .optional()
    .isURL()
    .withMessage('URL de avatar inválida'),
  body('timezone')
    .optional()
    .notEmpty()
    .withMessage('Timezone inválido'),
  body('language')
    .optional()
    .isIn(['es', 'en'])
    .withMessage('Idioma inválido')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener mayúsculas, minúsculas y números')
];

module.exports = {
  updateProfileValidation,
  changePasswordValidation
};