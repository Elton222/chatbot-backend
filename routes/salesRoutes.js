const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.post('/add', salesController.addSale);
router.get('/user/:userId', salesController.getSalesByUser);

module.exports = router;
