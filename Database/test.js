const mysql = require("mysql2");
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  
  connectionLimit: 10,       
  queueLimit: 0,             
});

const promisePool = pool.promise();  

/**
 * @param {string} sql 
 * @param {Array} params 
 * @returns {Promise<{rows: Array, fields: Array}>}
 */
async function executeQuery(sql, params = []) {
  try {
    
    const [rows, fields] = await promisePool.execute(sql, params);
    return rows;  // 
  } catch (err) {
    console.error("Шүүлт хийх үеийн алдаа:", err);
    throw new Error("Шүүлт хийхэд алдаа. Дэлгэрэнгүй");
  }
}

/**
 * @returns {Promise<void>} 
 */
async function testDatabaseConnection() {
  try {
    const data = await executeQuery(`select * from users`)
    console.log('Өгөгдлийн сан амжилттай холбогдлоо', data);
  } catch (err) {
    throw new Error('Өгөгдлийн сантай холбогдоход алдаа гарлаа');
  }
}

module.exports = { executeQuery, testDatabaseConnection };
