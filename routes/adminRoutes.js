const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const notificationController = require('../controllers/notificationController');

// GET /admin/users
router.get('/users', adminController.getUsers);

// DELETE /admin/users/:id
router.delete('/users/:id', adminController.deleteUser);

router.post('/notifications', notificationController.createNotification);



module.exports = router;
