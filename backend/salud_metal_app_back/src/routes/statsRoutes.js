const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/dashboard', authenticate, statsController.getDashboard);
router.get('/monthly', authenticate, statsController.getMonthly);

module.exports = router;