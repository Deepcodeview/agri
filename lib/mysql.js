const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'beejhealth_user',
  password: 'Deepak9955@',
  database: 'beejhealth',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDatabase() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(15) UNIQUE NOT NULL,
        name VARCHAR(100),
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS consultations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_phone VARCHAR(15),
        crop_type VARCHAR(50),
        disease_detected VARCHAR(100),
        confidence DECIMAL(5,2),
        symptoms TEXT,
        query TEXT,
        images JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS experts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        expertise JSON,
        location VARCHAR(100),
        rating DECIMAL(3,2) DEFAULT 4.5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database error:', error);
  }
}

module.exports = { pool, initDatabase };