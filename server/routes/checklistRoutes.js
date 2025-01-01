const express = require('express');
const {
  createChecklistItem,
  getChecklistItems,
  markChecklistItemComplete,
  editChecklistItem,
  deleteChecklistItem,
} = require('../controllers/checklistController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create-checklist/:userId', createChecklistItem);
router.get('/checklists/:userId', getChecklistItems);
router.put('/checklist/:itemId/check', markChecklistItemComplete);
router.put('/checklist/:itemId/edit', editChecklistItem);
router.delete('/checklist/:itemId', deleteChecklistItem);

module.exports = router;
