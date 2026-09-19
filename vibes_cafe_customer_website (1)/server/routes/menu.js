const express = require('express');
const { query, get, run } = require('../db');
const { authenticate } = require('./auth');
const { broadcast } = require('./events');

const router = express.Router();

// GET /api/menu - List all items with optional category and search query
router.get('/', async (req, res) => {
  try {
    const { category, search, popular } = req.query;
    let sql = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (popular === 'true' || popular === '1') {
      sql += ' AND is_popular = 1';
    }

    if (search) {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)';
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term);
    }

    sql += ' ORDER BY id ASC';
    const items = await query(sql, params);
    return res.json({ success: true, items });
  } catch (err) {
    console.error('Menu fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve menu items.' });
  }
});

// GET /api/menu/categories - Distinct categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await query('SELECT DISTINCT category FROM menu_items ORDER BY category ASC');
    return res.json({ success: true, categories: categories.map(c => c.category) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
});

// POST /api/menu - Create menu item (Admin only)
router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
    }

    const { name, category, price, description, image_url, is_vegetarian, is_available, is_popular } = req.body;
    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: 'Name, category, and price are required.' });
    }

    const result = await run(
      `INSERT INTO menu_items (name, category, price, description, image_url, is_vegetarian, is_available, is_popular)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        category.trim(),
        parseFloat(price),
        description || '',
        image_url || '',
        is_vegetarian ? 1 : 0,
        is_available !== undefined ? (is_available ? 1 : 0) : 1,
        is_popular ? 1 : 0
      ]
    );

    const newItem = await get('SELECT * FROM menu_items WHERE id = ?', [result.id]);
    broadcast('menu_updated', newItem);
    return res.status(201).json({ success: true, item: newItem });
  } catch (err) {
    console.error('Create menu item error:', err);
    return res.status(500).json({ error: 'Failed to create menu item.' });
  }
});

// PUT /api/menu/:id - Update item (Admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
    }

    const { id } = req.params;
    const { name, category, price, description, image_url, is_vegetarian, is_available, is_popular } = req.body;

    const existing = await get('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    await run(
      `UPDATE menu_items SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        price = COALESCE(?, price),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        is_vegetarian = COALESCE(?, is_vegetarian),
        is_available = COALESCE(?, is_available),
        is_popular = COALESCE(?, is_popular)
       WHERE id = ?`,
      [
        name,
        category,
        price !== undefined ? parseFloat(price) : null,
        description,
        image_url,
        is_vegetarian !== undefined ? (is_vegetarian ? 1 : 0) : null,
        is_available !== undefined ? (is_available ? 1 : 0) : null,
        is_popular !== undefined ? (is_popular ? 1 : 0) : null,
        id
      ]
    );

    const updated = await get('SELECT * FROM menu_items WHERE id = ?', [id]);
    broadcast('menu_updated', updated);
    return res.json({ success: true, item: updated });
  } catch (err) {
    console.error('Update menu item error:', err);
    return res.status(500).json({ error: 'Failed to update menu item.' });
  }
});

// PATCH /api/menu/:id/toggle - Toggle availability (Admin/Worker)
router.patch('/:id/toggle', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await get('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    const newStatus = existing.is_available ? 0 : 1;
    await run('UPDATE menu_items SET is_available = ? WHERE id = ?', [newStatus, id]);

    const updated = await get('SELECT * FROM menu_items WHERE id = ?', [id]);
    broadcast('menu_updated', updated);
    return res.json({ success: true, item: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to toggle item availability.' });
  }
});

// DELETE /api/menu/:id - Delete item (Admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
    }

    const { id } = req.params;
    await run('DELETE FROM menu_items WHERE id = ?', [id]);
    broadcast('menu_deleted', { id: parseInt(id) });
    return res.json({ success: true, message: 'Item deleted.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete menu item.' });
  }
});

module.exports = router;
