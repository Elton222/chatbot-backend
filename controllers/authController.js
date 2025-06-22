const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { name, email, password, phone } = req.body; // Include phone
  const hashed = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, phone, hashed], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User registered successfully' });
  });
};


exports.login = (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ success: false, message: 'User not found' });

    const user = results[0];
    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: 'Wrong password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  });
};

