const mysql = require('mysql2/promise')

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  // Create users table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20),
      password VARCHAR(255) NOT NULL,
      role ENUM('farmer', 'expert', 'superadmin') DEFAULT 'farmer',
      verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create consultations table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS consultations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      crop_type VARCHAR(100),
      disease_detected VARCHAR(255),
      confidence_score DECIMAL(5,2),
      recommendations TEXT,
      image_paths JSON,
      status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
      expert_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  console.log('Migration completed!')
  await connection.end()
}

migrate().catch(console.error)