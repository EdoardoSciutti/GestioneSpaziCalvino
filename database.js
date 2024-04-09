// +---------------------------------+
// |   I import the module I'll use  |
// +---------------------------------+

const mysql = require('mysql2');
require('dotenv').config();

//   +--------------------------------------------------+
//   |   I create a connection to the database server   |
//   +--------------------------------------------------+

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test'
});

//   +--------------------------------------------------+
//   |   I export the connection to the database server  |
//   +--------------------------------------------------+

module.exports = [pool.promise()];