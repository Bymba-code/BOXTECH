const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: '103.50.206.175',      // Replace with your DB host
  user: 'systemadmin',         // Replace with your DB username
  password: 'Jijgee030712@',    // Replace with your DB password
  database: 'BOXTECH',         // Replace with your DB name
  waitForConnections: true,    // Wait for available connection if all are in use
  connectionLimit: 10,         // Max number of connections in the pool
  queueLimit: 0,               // No limit for the query queue
});

// Promisify the pool for async/await usage
const promisePool = pool.promise();

/**
 * Executes a query against the database.
 * @param {string} query - The SQL query string.
 * @param {Array} params - The parameters for the SQL query.
 * @returns {Promise<Array>} The result rows from the query.
 */
const executeQuery = async (query, params = []) => {
  try {
    // Log the query and parameters (for debugging purposes)
    console.log('Executing query:', query);
    if (params.length > 0) {
      console.log('With parameters:', params);
    }

    // Execute the query
    const [rows, fields] = await promisePool.execute(query, params);

    // Log the results (can be removed in production)
    console.log('Query result:', rows);

    // Return the result
    return rows;
  } catch (error) {
    // Handle query error
    console.error('Database query failed:', error.message);
    console.error('Query:', query);
    console.error('Params:', params);

    throw new Error('Database query execution failed');
  }
};

/**
 * Test database connection at startup.
 * This function checks if the database is reachable.
 */
const testDatabaseConnection = async () => {
  try {
    // Get a connection from the pool and test it with a ping
    const connection = await promisePool.getConnection();
    await connection.ping();  // Send a ping to check if the database is reachable
    console.log('Database connection successful!');
    
    // Release the connection back to the pool
    connection.release();
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1); // Exit the application if the database connection fails
  }
};

// Export functions to use in other parts of the app
module.exports = { executeQuery, pool, testDatabaseConnection };
