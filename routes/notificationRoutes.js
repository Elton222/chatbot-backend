const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST /notifications
router.post('/', notificationController.createNotification);

// GET /notifications/:user_id
router.get('/:user_id', notificationController.getUserNotifications);

// PUT /notifications/:id/seen
router.put('/:id/seen', notificationController.markNotificationAsSeen);

module.exports = router;
