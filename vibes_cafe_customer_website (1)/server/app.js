const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { initDatabase } = require('./db');

// Import routes
const { router: authRouter } = require('./routes/auth');
const menuRouter = require('./routes/menu');
const ordersRouter = require('./routes/orders');
const reservationsRouter = require('./routes/reservations');
const branchesRouter = require('./routes/branches');
const galleryRouter = require('./routes/gallery');
const contactRouter = require('./routes/contact');
const metricsRouter = require('./routes/metrics');
const { eventsHandler } = require('./routes/events');
const reviewsRouter = require('./routes/reviews');

const CUSTOMER_PORT = process.env.CUSTOMER_PORT || 3000;
const ADMIN_PORT = process.env.ADMIN_PORT || 3001;

// Helper to configure shared static & API middlewares
function configureSharedMiddlewares(appInstance) {
  appInstance.use(cors());
  appInstance.use(cookieParser());
  appInstance.use(express.json());
  appInstance.use(express.urlencoded({ extended: true }));

  // Static Assets
  appInstance.use('/public', express.static(path.resolve(__dirname, '../public')));
  appInstance.use('/artisanal_warmth', express.static(path.resolve(__dirname, '../artisanal_warmth')));
  appInstance.use('/about_vibes_caf', express.static(path.resolve(__dirname, '../about_vibes_caf')));
  appInstance.use('/home_vibes_caf', express.static(path.resolve(__dirname, '../home_vibes_caf')));
  appInstance.use('/menu_vibes_caf', express.static(path.resolve(__dirname, '../menu_vibes_caf')));
  appInstance.use('/branches_vibes_caf', express.static(path.resolve(__dirname, '../branches_vibes_caf')));
  appInstance.use('/gallery_vibes_caf', express.static(path.resolve(__dirname, '../gallery_vibes_caf')));
  appInstance.use('/contact_vibes_caf', express.static(path.resolve(__dirname, '../contact_vibes_caf')));
  appInstance.use('/reviews_vibes_caf', express.static(path.resolve(__dirname, '../reviews_vibes_caf')));
  appInstance.use('/login_vibes_caf', express.static(path.resolve(__dirname, '../login_vibes_caf')));
  appInstance.use('/worker_dashboard_vibes_caf', express.static(path.resolve(__dirname, '../worker_dashboard_vibes_caf')));
  appInstance.use('/admin_dashboard_vibes_caf', express.static(path.resolve(__dirname, '../admin_dashboard_vibes_caf')));

  // Shared API Endpoints
  appInstance.use('/api/auth', authRouter);
  appInstance.use('/api/menu', menuRouter);
  appInstance.use('/api/orders', ordersRouter);
  appInstance.use('/api/reservations', reservationsRouter);
  appInstance.use('/api/branches', branchesRouter);
  appInstance.use('/api/gallery', galleryRouter);
  appInstance.use('/api/contact', contactRouter);
  appInstance.use('/api/metrics', metricsRouter);
  appInstance.use('/api/reviews', reviewsRouter);
  appInstance.get('/api/events', eventsHandler);
}

// ==========================================
// 1. CUSTOMER WEBSITE (PORT 3000)
// Pure customer guest experience (No Admin)
// ==========================================
const customerApp = express();
configureSharedMiddlewares(customerApp);

customerApp.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../home_vibes_caf/code.html'));
});

customerApp.get('/home', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../home_vibes_caf/code.html'));
});

customerApp.get('/menu', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../menu_vibes_caf/code.html'));
});

customerApp.get('/about', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../about_vibes_caf/code.html'));
});

customerApp.get('/branches', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../branches_vibes_caf/code.html'));
});

customerApp.get('/gallery', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../gallery_vibes_caf/code.html'));
});

customerApp.get('/contact', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../contact_vibes_caf/code.html'));
});

customerApp.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../login_vibes_caf/code.html'));
});

customerApp.get('/reviews', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../reviews_vibes_caf/code.html'));
});

customerApp.get(['/worker', '/worker-dashboard'], (req, res) => {
  res.sendFile(path.resolve(__dirname, '../worker_dashboard_vibes_caf/code.html'));
});

customerApp.get(['/admin', '/admin-dashboard'], (req, res) => {
  res.sendFile(path.resolve(__dirname, '../admin_dashboard_vibes_caf/code.html'));
});

// Customer Fallback 404
customerApp.use((req, res) => {
  if (req.accepts('html')) {
    res.redirect('/home');
  } else {
    res.status(404).json({ error: 'Endpoint not found.' });
  }
});


// ==========================================
// 2. STAFF & ADMIN WEBSITE (PORT 3001)
// Operations, Barista KDS & Owner Management
// ==========================================
const adminApp = express();
configureSharedMiddlewares(adminApp);

adminApp.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../login_vibes_caf/code.html'));
});

adminApp.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../login_vibes_caf/code.html'));
});

adminApp.get('/worker', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../worker_dashboard_vibes_caf/code.html'));
});

adminApp.get('/worker-dashboard', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../worker_dashboard_vibes_caf/code.html'));
});

adminApp.get('/admin', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../admin_dashboard_vibes_caf/code.html'));
});

adminApp.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../admin_dashboard_vibes_caf/code.html'));
});

// Admin Fallback
adminApp.use((req, res) => {
  if (req.accepts('html')) {
    res.redirect('/');
  } else {
    res.status(404).json({ error: 'Endpoint not found.' });
  }
});


// ==========================================
// SERVER INITIALIZATION & LAUNCH
// ==========================================
const startServers = async () => {
  try {
    await initDatabase();

    // 1. Launch Customer Website
    customerApp.listen(CUSTOMER_PORT, () => {
      console.log(`☕ [WEBSITE 1] Customer Website running at: http://localhost:${CUSTOMER_PORT}`);
    });

    // 2. Launch Staff & Admin Website
    adminApp.listen(ADMIN_PORT, () => {
      console.log(`🛡️ [WEBSITE 2] Staff & Admin Portal running at: http://localhost:${ADMIN_PORT}`);
      console.log(`   ☕ Barista KDS: http://localhost:${ADMIN_PORT}/worker`);
      console.log(`   👑 Admin Hub:   http://localhost:${ADMIN_PORT}/admin`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServers();
}

module.exports = { customerApp, adminApp };
