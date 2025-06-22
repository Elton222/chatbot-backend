const express = require('express');
const router = express.Router();
const salesReportController = require('../controllers/salesReportController');

// Generate a new sales report for a farmer
router.post('/reports/generate/:userId', salesReportController.generateReport);

// Get all sales reports for a farmer
router.get('/reports/:userId', salesReportController.getReports);

module.exports = router;
