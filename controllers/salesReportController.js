const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

exports.generateReport = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { report_month } = req.body;

    // Query total sales for the user in the specified month (PostgreSQL uses TO_CHAR for date formatting)
    const salesResult = await pool.query(
      `SELECT SUM(amount) as total_sales 
       FROM sales 
       WHERE user_id = $1 
         AND TO_CHAR(sale_date, 'YYYY-MM') = $2`,
      [userId, report_month]
    );

    const totalSales = salesResult.rows[0].total_sales || 0;

    const fileName = `sales_report_${userId}_${report_month}.txt`;
    const reportsDir = path.join(__dirname, 'reports');
    const filePath = path.join(reportsDir, fileName);

    const reportContent = `Sales Report for ${report_month}\nTotal Sales: $${Number(totalSales).toFixed(2)}`;

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    fs.writeFileSync(filePath, reportContent);

    // Insert the report record with RETURNING id if you want
    await pool.query(
      `INSERT INTO sales_reports (user_id, report_month, total_sales, file_url) 
       VALUES ($1, $2, $3, $4)`,
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
    const reportsResult = await pool.query(
      `SELECT * FROM sales_reports WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(reportsResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching reports' });
  }
};
