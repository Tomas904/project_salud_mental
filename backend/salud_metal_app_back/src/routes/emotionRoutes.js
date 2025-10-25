const express = require('express');
const router = express.Router();
const emotionController = require('../controllers/emotionController');
const { authenticate } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createEmotionValidation } = require('../validations/emotionValidation');

router.post('/', authenticate, createEmotionValidation, validateRequest, emotionController.createEmotion);
router.get('/', authenticate, emotionController.getEmotions);
router.get('/weekly', authenticate, emotionController.getWeeklyEmotions);
router.get('/:id', authenticate, emotionController.getEmotionById);
router.put('/:id', authenticate, createEmotionValidation, validateRequest, emotionController.updateEmotion);
router.delete('/:id', authenticate, emotionController.deleteEmotion);

module.exports = router;