const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/', authenticate, challengeController.getChallenges);
router.post('/:challengeId/start', authenticate, challengeController.startChallenge);
router.get('/my-challenges', authenticate, challengeController.getMyChallenges);
router.post('/:userChallengeId/complete-day', authenticate, challengeController.completeDay);
router.delete('/:userChallengeId', authenticate, challengeController.abandonChallenge);

module.exports = router;