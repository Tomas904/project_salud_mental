const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/', authenticate, exerciseController.getExercises);
router.get('/my-history', authenticate, exerciseController.getHistory);
router.get('/:id', authenticate, exerciseController.getExerciseById);
router.post('/:id/complete', authenticate, exerciseController.completeExercise);

module.exports = router;