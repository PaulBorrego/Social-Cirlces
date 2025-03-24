const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.RANDOMNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

connection.connect((err => {
    if(err) throw err;
    console.log(`MySQL connection successful!`);
}));

module.exports = connection;
