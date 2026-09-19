const express = require('express');
const { query, get, run } = require('../db');
const { authenticate } = require('./auth');
const { broadcast } = require('./events');

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const result = await run(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name.trim(), email.trim(), subject ? subject.trim() : 'General Inquiry', message.trim()]
    );

    const newMessage = await get('SELECT * FROM contact_messages WHERE id = ?', [result.id]);
    broadcast('new_contact_message', newMessage);

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! We will get back to you shortly.',
      data: newMessage
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ error: 'Failed to submit message. Please try again.' });
  }
});

// GET /api/contact - View contact messages (Admin/Worker)
router.get('/', authenticate, async (req, res) => {
  try {
    const messages = await query('SELECT * FROM contact_messages ORDER BY id DESC');
    return res.json({ success: true, messages });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve messages.' });
  }
});

// PATCH /api/contact/:id/read - Mark message as read
router.patch('/:id/read', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await run('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Marked as read.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update message.' });
  }
});

module.exports = router;
