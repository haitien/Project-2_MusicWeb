const pool = require('./db-connect');
const bcrypt = require('bcrypt');
const AppConstants = require('../core/app-constants');

function crypt(password) {
    return bcrypt.hashSync(password, 10);
}

const seed = async function () {
    const avatar = AppConstants.AVATAR_URL;
    pool.getConnection(function (err, connection) {
        connection.query('TRUNCATE TABLE users');
        connection.query(`INSERT INTO users( username,       password,                           email,                 first_name,     last_name,        avatar,            birthday,         is_admin) \
                   VALUES ( 'name1',       '${crypt('12345678')}',     'name1@gmail.com',     'Quang',        'nguyen',         '${avatar}',       '1997-04-15',         false),  \
                          ( 'name2',       '${crypt('12345678')}',     'name2@gmail.com',     'Truong',       'nguyen',         '${avatar}',       '1997-04-15',         true), \
                          ( 'name3',       '${crypt('12345678')}',     'name3@gmail.com',     'Phuc',         'nguyen',         '${avatar}',       '1997-04-15',         false),  \
                          ( 'name4',       '${crypt('12345678')}',     'name4@gmail.com',     'Nghia',        'nguyen',         '${avatar}',       '1997-04-15',         false);`,
            function () {
                connection.release();
                pool.end();
            })
    })
};
module.exports = seed;