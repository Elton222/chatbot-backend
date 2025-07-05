const db = require('../config/db');

// Create a notification
exports.createNotification = async (req, res) => {
  const { user_id, message, type } = req.body;
  const sql = `INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3) RETURNING id`;
  try {
    const result = await db.query(sql, [user_id, message, type]);
    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  const { user_id } = req.params;
  const sql = `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`;
  try {
    const result = await db.query(sql, [user_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark a notification as seen
exports.markNotificationAsSeen = async (req, res) => {
  const { id } = req.params;
  const sql = `UPDATE notifications SET seen = TRUE WHERE id = $1`;
  try {
    await db.query(sql, [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
