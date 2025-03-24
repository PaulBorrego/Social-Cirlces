const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.RANDOMNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 3306
});

connection.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

module.exports = connection;