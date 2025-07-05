const db = require('../config/db');

// Add sale
exports.addSale = async (req, res) => {
  const { user_id, product_id, quantity, price, sale_date } = req.body;
  const total = quantity * price;

  try {
    const sql = `
      INSERT INTO sales (user_id, product_id, quantity, price, total, sale_date) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await db.query(sql, [user_id, product_id, quantity, price, total, sale_date]);
    res.status(201).json({ message: 'Sale recorded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sales summary by user
exports.getSalesByUser = async (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT sales.*, products.name AS product_name
    FROM sales
    JOIN products ON sales.product_id = products.id
    WHERE sales.user_id = $1
    ORDER BY sale_date DESC
  `;

  try {
    const results = await db.query(sql, [userId]);
    res.json(results.rows);
  } catch (err) {
    console.error('DB query error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
