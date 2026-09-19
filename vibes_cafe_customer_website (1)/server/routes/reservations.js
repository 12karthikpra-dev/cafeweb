const express = require('express');
const { query, get, run } = require('../db');
const { broadcast } = require('./events');

const router = express.Router();

// GET /api/reservations - List reservations
router.get('/', async (req, res) => {
  try {
    const { status, date } = req.query;
    let sql = 'SELECT * FROM reservations WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (date) {
      sql += ' AND reservation_date = ?';
      params.push(date);
    }

    sql += ' ORDER BY id DESC';
    const reservations = await query(sql, params);
    return res.json({ success: true, reservations });
  } catch (err) {
    console.error('Fetch reservations error:', err);
    return res.status(500).json({ error: 'Failed to retrieve reservations.' });
  }
});

// POST /api/reservations - Create reservation
router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, branch_name, table_info, guests, reservation_date, reservation_time, notes } = req.body;

    if (!customer_name || !customer_email || !customer_phone || !branch_name || !reservation_date || !reservation_time) {
      return res.status(400).json({ error: 'Name, email, phone, branch, date, and time are required.' });
    }

    const result = await run(
      `INSERT INTO reservations (customer_name, customer_email, customer_phone, branch_name, table_info, guests, reservation_date, reservation_time, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
      [
        customer_name.trim(),
        customer_email.trim(),
        customer_phone.trim(),
        branch_name.trim(),
        table_info || 'Standard Seating',
        parseInt(guests) || 2,
        reservation_date.trim(),
        reservation_time.trim(),
        notes || ''
      ]
    );

    const newReservation = await get('SELECT * FROM reservations WHERE id = ?', [result.id]);
    broadcast('new_reservation', newReservation);

    return res.status(201).json({
      success: true,
      message: 'Reservation booked successfully.',
      reservation: newReservation
    });
  } catch (err) {
    console.error('Create reservation error:', err);
    return res.status(500).json({ error: 'Failed to book reservation.' });
  }
});

// PATCH /api/reservations/:id/status - Update reservation status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'seated', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const existing = await get('SELECT * FROM reservations WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    await run('UPDATE reservations SET status = ? WHERE id = ?', [status, id]);
    const updated = await get('SELECT * FROM reservations WHERE id = ?', [id]);

    broadcast('reservation_status_updated', updated);

    return res.json({ success: true, reservation: updated });
  } catch (err) {
    console.error('Update reservation status error:', err);
    return res.status(500).json({ error: 'Failed to update reservation status.' });
  }
});

// DELETE /api/reservations/:id - Delete reservation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM reservations WHERE id = ?', [id]);
    broadcast('reservation_deleted', { id: parseInt(id) });
    return res.json({ success: true, message: 'Reservation removed.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete reservation.' });
  }
});

module.exports = router;
