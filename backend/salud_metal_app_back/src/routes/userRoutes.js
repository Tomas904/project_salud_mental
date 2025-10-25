const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { updateProfileValidation, changePasswordValidation } = require('../validations/userValidation');

router.get('/me', authenticate, userController.getMe);
router.put('/me', authenticate, updateProfileValidation, validateRequest, userController.updateProfile);
router.put('/me/password', authenticate, changePasswordValidation, validateRequest, userController.changePassword);
router.delete('/me', authenticate, userController.deleteAccount);

module.exports = router;