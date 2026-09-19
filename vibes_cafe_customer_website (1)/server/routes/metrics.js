const express = require('express');
const { query, get } = require('../db');

const router = express.Router();

// GET /api/metrics - Get overview metrics for Admin Dashboard
router.get('/', async (req, res) => {
  try {
    // Total revenue from non-cancelled orders
    const revRow = await get("SELECT SUM(total_amount) as total_revenue, COUNT(id) as total_orders FROM orders WHERE status != 'cancelled'");
    const totalRevenue = revRow && revRow.total_revenue ? parseFloat(revRow.total_revenue) : 0;
    const totalOrders = revRow && revRow.total_orders ? parseInt(revRow.total_orders) : 0;
    const avgTicket = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

    // Active reservations count
    const resRow = await get("SELECT COUNT(id) as active_count FROM reservations WHERE status = 'active'");
    const activeReservations = resRow && resRow.active_count ? parseInt(resRow.active_count) : 0;

    // Preparing orders count
    const prepRow = await get("SELECT COUNT(id) as prep_count FROM orders WHERE status IN ('pending', 'preparing')");
    const activeOrders = prepRow && prepRow.prep_count ? parseInt(prepRow.prep_count) : 0;

    return res.json({
      success: true,
      metrics: {
        todayRevenue: totalRevenue.toFixed(2),
        totalOrders,
        activeReservations,
        activeOrders,
        avgTicket: avgTicket.toFixed(2),
        revenueGrowth: '+12%',
        ordersGrowth: '+5%'
      }
    });
  } catch (err) {
    console.error('Metrics calculation error:', err);
    return res.status(500).json({ error: 'Failed to compute metrics.' });
  }
});

module.exports = router;
