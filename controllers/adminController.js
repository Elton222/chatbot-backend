const db = require('../config/db');

// ✅ Get all users (non-admin)
exports.getUsers = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, phone, role FROM users WHERE role != 'admin'"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete user by ID (except admin)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 AND role != 'admin'",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found or cannot delete admin' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
