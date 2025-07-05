const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ REGISTER USER
exports.register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  try {
    const hashed = bcrypt.hashSync(password, 10);
    await db.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5)',
      [name, email, phone, hashed, role]
    );
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ LOGIN USER
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Wrong password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
