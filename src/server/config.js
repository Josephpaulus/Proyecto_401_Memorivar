const mysql = require('mysql');

// Set database connection credentials
const config = {
    host: '185.156.219.153',
    user: 'b177337_admin',
    password: '1IB_3LVC(H+6',
    port: 3306,
    database: 'b177337_memorivar_db'
};

// Create a MySQL pool
const pool = mysql.createPool(config);

// Export the pool
module.exports = pool;