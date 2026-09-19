const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../vibes_cafe.db');
const db = new sqlite3.Database(dbPath);

// Helper functions for async queries
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const initDatabase = async () => {
  // Users table
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'worker', 'customer')) NOT NULL DEFAULT 'customer',
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Menu items table
  await run(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image_url TEXT,
      is_vegetarian INTEGER DEFAULT 0,
      is_available INTEGER DEFAULT 1,
      is_popular INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Orders table
  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT,
      order_type TEXT CHECK(order_type IN ('dine-in', 'takeaway')) NOT NULL DEFAULT 'dine-in',
      table_number TEXT,
      items_json TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT CHECK(status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')) NOT NULL DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Reservations table
  await run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      branch_name TEXT NOT NULL,
      table_info TEXT,
      guests INTEGER NOT NULL DEFAULT 2,
      reservation_date TEXT NOT NULL,
      reservation_time TEXT NOT NULL,
      status TEXT CHECK(status IN ('active', 'seated', 'cancelled')) NOT NULL DEFAULT 'active',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Branches table
  await run(`
    CREATE TABLE IF NOT EXISTS branches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      district TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      hours TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Open Now',
      image_url TEXT,
      map_image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Gallery table
  await run(`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contact messages table
  await run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  // Reviews & Complaints table
  await run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_name TEXT NOT NULL,
      type TEXT CHECK(type IN ('review', 'complaint', 'suggestion')) NOT NULL DEFAULT 'review',
      rating INTEGER CHECK(rating BETWEEN 1 AND 5),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_visible INTEGER DEFAULT 1,
      is_resolved INTEGER DEFAULT 0,
      staff_response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

module.exports = {
  db,
  query,
  get,
  run,
  initDatabase
};
