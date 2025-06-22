const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

exports.generateReport = async (req, res) => {
  try {
    const userId = req.params.userId; // get user ID from route param or JWT auth
    const { report_month } = req.body;

    // 1. Calculate total sales for the month for the user (dummy example)
    // Replace with your actual sales table query
    const [salesResult] = await pool.query(
      `SELECT SUM(amount) as total_sales FROM sales WHERE user_id = ? AND DATE_FORMAT(sale_date, '%Y-%m') = ?`,
      [userId, report_month]
    );

    const totalSales = salesResult[0].total_sales || 0;

    // 2. Create a simple report file (CSV or TXT)
    const fileName = `sales_report_${userId}_${report_month}.txt`;
    const filePath = path.join(__dirname, 'reports', fileName);

    const reportContent = `Sales Report for ${report_month}\nTotal Sales: $${totalSales.toFixed(2)}`;
    
    // Make sure reports folder exists
    if (!fs.existsSync(path.join(__dirname, 'reports'))) {
      fs.mkdirSync(path.join(__dirname, 'reports'));
    }
    
    fs.writeFileSync(filePath, reportContent);

    // 3. Insert record in sales_reports table
    await pool.query(
      `INSERT INTO sales_reports (user_id, report_month, total_sales, file_url) VALUES (?, ?, ?, ?)`,
      [userId, report_month, totalSales, `/reports/${fileName}`]
    );

    res.status(201).json({ message: 'Report generated successfully', file_url: `/reports/${fileName}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error generating report' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const userId = req.params.userId;
    const [reports] = await pool.query(
      `SELECT * FROM sales_reports WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching reports' });
  }
};
