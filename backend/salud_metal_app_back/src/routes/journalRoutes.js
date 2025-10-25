const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { authenticate } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createJournalValidation } = require('../validations/journalValidation');

router.post('/', authenticate, createJournalValidation, validateRequest, journalController.createEntry);
router.get('/', authenticate, journalController.getEntries);
router.get('/:id', authenticate, journalController.getEntryById);
router.put('/:id', authenticate, createJournalValidation, validateRequest, journalController.updateEntry);
router.delete('/:id', authenticate, journalController.deleteEntry);

module.exports = router;