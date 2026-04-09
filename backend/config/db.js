const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: parseInt(process.env.MYSQLPORT) || 3306,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection with debug info
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL Connected Successfully on Railway!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL Connection Error:', err.message);
    console.error('Host used     :', process.env.MYSQLHOST);
    console.error('User used     :', process.env.MYSQLUSER);
    console.error('Database used :', process.env.MYSQLDATABASE);
  });

module.exports = pool;