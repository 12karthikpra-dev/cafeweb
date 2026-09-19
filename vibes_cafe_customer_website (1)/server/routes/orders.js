const express = require('express');
const { query, get, run } = require('../db');
const { broadcast } = require('./events');

const router = express.Router();

// GET /api/orders - List orders with optional status filters
router.get('/', async (req, res) => {
  try {
    const { status, limit } = req.query;
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY id DESC';
    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const rows = await query(sql, params);
    const orders = rows.map(r => {
      let parsedItems = [];
      try {
        parsedItems = JSON.parse(r.items_json);
      } catch (e) {
        parsedItems = [];
      }
      return {
        ...r,
        items: parsedItems
      };
    });

    return res.json({ success: true, orders });
  } catch (err) {
    console.error('Fetch orders error:', err);
    return res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});

// POST /api/orders - Place a new order
router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, order_type, table_number, items, notes } = req.body;

    if (!customer_name || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Customer name and at least one item are required.' });
    }

    // Calculate total amount
    let total_amount = 0;
    const validatedItems = items.map(item => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      total_amount += price * quantity;
      return {
        id: item.id,
        name: item.name,
        price,
        quantity,
        notes: item.notes || ''
      };
    });

    // Generate random 4-digit order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_number = `VC-${randomSuffix}`;

    const result = await run(
      `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, order_type, table_number, items_json, total_amount, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        order_number,
        customer_name.trim(),
        customer_email ? customer_email.trim() : null,
        customer_phone ? customer_phone.trim() : null,
        order_type === 'takeaway' ? 'takeaway' : 'dine-in',
        table_number || null,
        JSON.stringify(validatedItems),
        parseFloat(total_amount.toFixed(2)),
        notes || ''
      ]
    );

    const newOrder = await get('SELECT * FROM orders WHERE id = ?', [result.id]);
    newOrder.items = validatedItems;

    broadcast('new_order', newOrder);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order: newOrder
    });
  } catch (err) {
    console.error('Place order error:', err);
    return res.status(500).json({ error: 'Failed to place order.' });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const existing = await get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    await run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    const updated = await get('SELECT * FROM orders WHERE id = ?', [id]);
    try {
      updated.items = JSON.parse(updated.items_json);
    } catch (e) {
      updated.items = [];
    }

    broadcast('order_status_updated', updated);

    return res.json({ success: true, order: updated });
  } catch (err) {
    console.error('Update order status error:', err);
    return res.status(500).json({ error: 'Failed to update order status.' });
  }
});

module.exports = router;
