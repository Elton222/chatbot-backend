const db = require('../config/db'); // This should export pg Pool instance
const { getAIResponse } = require('../ai/chatbotLogic');

exports.handleUserMessage = async (req, res) => {
  const { userId, message } = req.body;

  try {
    // AI logic (placeholder)
    const aiResponse = await getAIResponse(message);

    // Save message and response
    const queryText = `
      INSERT INTO messages (user_id, message, response, created_at)
      VALUES ($1, $2, $3, NOW())
    `;

    await db.query(queryText, [userId, message, aiResponse]);

    res.json({ reply: aiResponse });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
