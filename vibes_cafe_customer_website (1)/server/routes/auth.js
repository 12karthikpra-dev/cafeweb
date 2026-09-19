const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run } = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vibes_cafe_super_secret_jwt_key_2026';

// Middleware to extract auth user
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await get('SELECT id, name, email, role, avatar_url FROM users WHERE id = ?', [decoded.id]);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid ID or password.' });
    }

    if (req.body.requiredRole && user.role !== req.body.requiredRole) {
      if (req.body.requiredRole === 'admin') {
        return res.status(403).json({ error: 'Access Denied: Barista credentials cannot open the Owner & Admin Portal.' });
      } else if (req.body.requiredRole === 'worker') {
        return res.status(403).json({ error: 'Access Denied: Please use your Barista credentials for the Kitchen Display System.' });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: false, // Accessible to client JS for simplicity
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Register (Customer)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await run(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), password_hash, 'customer']
    );

    const token = jwt.sign(
      { id: result.id, email: email.toLowerCase().trim(), role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: result.id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'customer'
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// Get current logged-in user
router.get('/me', authenticate, (req, res) => {
  return res.json({ user: req.user });
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully.' });
});

module.exports = {
  router,
  authenticate
};
