const db = require('../config/db');



// Add sale
exports.addSale = async (req, res) => {
  const { user_id, product_id, quantity, price, sale_date } = req.body;
  const total = quantity * price;

  

  try {
    await db.execute(
      `INSERT INTO sales (user_id, product_id, quantity, price, total, sale_date) VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, product_id, quantity, price, total, sale_date]
    );
    res.status(201).json({ message: 'Sale recorded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sales summary by user
exports.getSalesByUser = (req, res) => {
  const userId = req.params.userId;

  db.execute(
    `SELECT sales.*, products.name AS product_name
     FROM sales
     JOIN products ON sales.product_id = products.id
     WHERE sales.user_id = ?
     ORDER BY sale_date DESC`,
    [userId],
    (err, results) => {
      if (err) {
        console.error('DB query error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      // 'results' here is an array of rows
      res.json(results);
    }
  );
};