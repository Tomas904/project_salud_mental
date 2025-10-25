const express = require('express');
const router = express.Router();
const tipController = require('../controllers/tipController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/', authenticate, tipController.getTips);
router.get('/favorites', authenticate, tipController.getFavorites);
router.post('/:tipId/favorite', authenticate, tipController.addFavorite);
router.delete('/:tipId/favorite', authenticate, tipController.removeFavorite);

module.exports = router;