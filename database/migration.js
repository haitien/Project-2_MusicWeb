const pool = require('./db-connect');

async function migration() {
    pool.getConnection(function (err, connection) {
        connection.query('DROP TABLE IF EXISTS users;');
        connection.query('CREATE TABLE users(     \
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, \
        username VARCHAR (50) UNIQUE NOT NULL,\
        password VARCHAR (100) NOT NULL,\
        email VARCHAR (100) UNIQUE NOT NULL,\
        first_name VARCHAR (50) NOT NULL,  \
        last_name VARCHAR (50) NOT NULL, \
        avatar VARCHAR (100) NOT NULL,\
        birthday date NOT NULL,\
        is_admin boolean NOT NULL);', function () {
            connection.release();
            pool.end()
        })
    });
}

migration();
