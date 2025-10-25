const express = require('express');
const router = express.Router();
const medalController = require('../controllers/medalController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/my-medals', authenticate, medalController.getMyMedals);
router.get('/available', authenticate, medalController.getAvailableMedals);

module.exports = router;