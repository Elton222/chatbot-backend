const db = require('../config/db');
const { getAIResponse } = require('../ai/chatbotLogic');

exports.handleUserMessage = async (req, res) => {
  const { userId, message } = req.body;

  try {
    // AI logic (placeholder)
    const aiResponse = await getAIResponse(message);

    // Save message and response
    db.query(
      'INSERT INTO messages (user_id, message, response, created_at) VALUES (?, ?, ?, NOW())',
      [userId, message, aiResponse],
      (err) => {
        if (err) throw err;
        res.json({ reply: aiResponse });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
