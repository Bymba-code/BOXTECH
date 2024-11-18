const mysql = require("mysql2");
require('dotenv').config();

// Create the MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  // You should generally set this to true for better handling of concurrent connections
  connectionLimit: 10,       // Optional: adjust based on expected traffic
  queueLimit: 0,             // Optional: no limit on queued connections
});

const promisePool = pool.promise();  // Get promise-based API for async/await

/**
 * Executes a query on the database.
 * @param {string} sql - The SQL query to execute.
 * @param {Array} params - The parameters for the query (default is an empty array).
 * @returns {Promise<{rows: Array, fields: Array}>} The result of the query.
 */
async function executeQuery(sql, params = []) {
  try {
    // Execute the query with parameters
    const [rows, fields] = await promisePool.execute(sql, params);
    return rows;  // Always return both rows and fields, even if you don't need fields
  } catch (err) {
    console.error("Database query error:", err);
    throw new Error("Database query failed. Please check logs for more details.");
  }
}

/**
 * @returns {Promise<void>} 
 */
async function testDatabaseConnection() {
  try {
    const data = await executeQuery(`select * from users`)
    console.log('Database connection successful:', data);
  } catch (err) {
    throw new Error('Failed to connect to the database.');
  }
}

module.exports = { executeQuery, testDatabaseConnection };
