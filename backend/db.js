const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

let db;
let pool;

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && process.env.DATABASE_URL) {
  // Production: Use PostgreSQL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  // Wrapper to use pg Pool like sqlite3
  db = {
    run: (sql, params, callback) => {
      pool.query(sql, params, (err, result) => {
        callback(err);
      });
    },
    get: (sql, params, callback) => {
      pool.query(sql, params, (err, result) => {
        callback(err, result?.rows?.[0]);
      });
    },
    all: (sql, params, callback) => {
      pool.query(sql, params, (err, result) => {
        callback(err, result?.rows);
      });
    },
    serialize: (fn) => fn(),
  };

  console.log('🗄️ Using PostgreSQL database (production)');
} else {
  // Development: Use SQLite
  const dbPath = path.join(__dirname, 'email_client.db');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database error:', err.message);
    else console.log('🗄️ Connected to SQLite database (local)');
  });
}

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      refresh_token TEXT,
      access_token TEXT,
      token_expiry BIGINT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id TEXT PRIMARY KEY,
      user_id TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;
