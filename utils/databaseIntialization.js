// Importing mysql2 module
const mysql = require('mysql2');

// Importing DB config
const { dbConfig } = require('../config');

// Create connection to database
const connection = mysql.createConnection({
  host: dbConfig.DB_HOST,
  user: dbConfig.DB_USER,
  password: dbConfig.DB_PASSWORD,
});

// Create DB if not found
connection.query(
  `CREATE DATABASE IF NOT EXISTS ${dbConfig.DATABASE_NAME};`,
  function (err, results, fields) {
    if (!err) console.log('Database created');
    else console.log(err);
  }
);

// Ending connection
connection.end();
