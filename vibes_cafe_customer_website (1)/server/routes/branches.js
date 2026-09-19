const express = require('express');
const { query, get, run } = require('../db');

const router = express.Router();

// GET /api/branches - List all branches with optional district filter
router.get('/', async (req, res) => {
  try {
    const { district } = req.query;
    let sql = 'SELECT * FROM branches';
    const params = [];

    if (district && district !== 'All Locations') {
      sql += ' WHERE LOWER(district) = LOWER(?)';
      params.push(district);
    }

    sql += ' ORDER BY id ASC';
    const branches = await query(sql, params);
    return res.json({ success: true, branches });
  } catch (err) {
    console.error('Fetch branches error:', err);
    return res.status(500).json({ error: 'Failed to retrieve branches.' });
  }
});

module.exports = router;
