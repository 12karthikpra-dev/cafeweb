const express = require('express');
const router = express.Router();
const { query, get, run } = require('../db');
const { broadcast } = require('./events');

// GET all visible reviews (public endpoint - for customer page)
router.get('/', async (req, res) => {
  try {
    const reviews = await query(
      `SELECT * FROM reviews WHERE is_visible = 1 ORDER BY created_at DESC`
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// GET all reviews including hidden ones (admin/staff only via query param)
router.get('/all', async (req, res) => {
  try {
    const reviews = await query(
      `SELECT * FROM reviews ORDER BY created_at DESC`
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// POST submit a new review/complaint/suggestion (public)
router.post('/', async (req, res) => {
  try {
    const { author_name, type, rating, title, message } = req.body;

    if (!author_name || !title || !message) {
      return res.status(400).json({ error: 'Name, title, and message are required.' });
    }
    const validType = ['review', 'complaint', 'suggestion'].includes(type) ? type : 'review';
    const validRating = rating >= 1 && rating <= 5 ? rating : null;

    const result = await run(
      `INSERT INTO reviews (author_name, type, rating, title, message) VALUES (?, ?, ?, ?, ?)`,
      [author_name, validType, validRating, title, message]
    );

    const newReview = await get('SELECT * FROM reviews WHERE id = ?', [result.id]);
    broadcast('new_review', newReview);
    res.status(201).json({ success: true, review: newReview });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

// PATCH toggle visibility (admin only)
router.patch('/:id/visibility', async (req, res) => {
  try {
    const { is_visible } = req.body;
    await run('UPDATE reviews SET is_visible = ? WHERE id = ?', [is_visible ? 1 : 0, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update visibility.' });
  }
});

// PATCH mark as resolved + add staff response (admin/staff)
router.patch('/:id/resolve', async (req, res) => {
  try {
    const { staff_response } = req.body;
    await run(
      'UPDATE reviews SET is_resolved = 1, staff_response = ? WHERE id = ?',
      [staff_response || '', req.params.id]
    );
    const updated = await get('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    broadcast('review_resolved', updated);
    res.json({ success: true, review: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve review.' });
  }
});

// DELETE a review (admin only)
router.delete('/:id', async (req, res) => {
  try {
    await run('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review.' });
  }
});

module.exports = router;
