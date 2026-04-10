require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'vigneshwaran',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'sponsored_analytics',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // ssl: { rejectUnauthorized: false }, // uncomment only if you hit SSL issues on Railway
});

// Test the connection at startup
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL Connected Successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL Connection Error:', err.message);
  });

module.exports = pool;