const express = require('express');
const { createNotification, getNotifications } = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create-notification', createNotification);
router.get('/notifications/:userId', getNotifications);

module.exports = router;
