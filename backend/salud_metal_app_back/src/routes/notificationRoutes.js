const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/settings', authenticate, notificationController.getSettings);
router.put('/settings', authenticate, notificationController.updateSettings);

module.exports = router;