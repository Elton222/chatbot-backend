const db = require('../config/db');

// Create a notification
exports.createNotification = (req, res) => {
  const { user_id, message, type } = req.body;
  const sql = `INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)`;
  db.query(sql, [user_id, message, type], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ success: true, id: result.insertId });
  });
};

// Get all notifications for a user
exports.getUserNotifications = (req, res) => {
  const { user_id } = req.params;
  const sql = `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`;
  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Mark a notification as seen
exports.markNotificationAsSeen = (req, res) => {
  const { id } = req.params;
  const sql = `UPDATE notifications SET seen = TRUE WHERE id = ?`;
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
};
