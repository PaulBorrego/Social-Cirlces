const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: 13174,
    charset: 'utf8mb4'
});

connection.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

module.exports = connection;