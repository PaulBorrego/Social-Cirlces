const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',//put your own password
    database: 'socialcircles'
});

connection.connect((err => {
    if(err) throw err;
    console.log(`MySQL connection successful!`);
}));

module.exports = connection;