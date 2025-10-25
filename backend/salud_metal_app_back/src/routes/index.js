const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const emotionRoutes = require('./emotionRoutes');
const journalRoutes = require('./journalRoutes');
const challengeRoutes = require('./challengeRoutes');
const medalRoutes = require('./medalRoutes');
const tipRoutes = require('./tipRoutes');
const exerciseRoutes = require('./exerciseRoutes');
const notificationRoutes = require('./notificationRoutes');
const statsRoutes = require('./statsRoutes');
const searchRoutes = require('./searchRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/emotions', emotionRoutes);
router.use('/journal', journalRoutes);
router.use('/challenges', challengeRoutes);
router.use('/medals', medalRoutes);
router.use('/tips', tipRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/notifications', notificationRoutes);
router.use('/stats', statsRoutes);
router.use('/search', searchRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;