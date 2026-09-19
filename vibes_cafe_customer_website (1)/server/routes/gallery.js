const express = require('express');
const { query, run } = require('../db');

const router = express.Router();

// GET /api/gallery - List gallery items with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM gallery_items';
    const params = [];

    if (category && category !== 'ALL') {
      sql += ' WHERE UPPER(category) = UPPER(?)';
      params.push(category);
    }

    sql += ' ORDER BY id ASC';
    const items = await query(sql, params);
    return res.json({ success: true, items });
  } catch (err) {
    console.error('Fetch gallery error:', err);
    return res.status(500).json({ error: 'Failed to retrieve gallery.' });
  }
});

module.exports = router;
