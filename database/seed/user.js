const pool = require('../dbConnect');
const bcrypt = require('bcrypt');
function crypt(password) {
    return bcrypt.hashSync(password, 10);
}
const seed = async function () {
    await pool.query('TRUNCATE TABLE users');
    await pool.query(
        `INSERT INTO users( username,       password,                           email,                 first_name,      last_name,        avatar,                                                                                     date_of_birth,        is_admin) \
                   VALUES ( 'name1',       '${crypt('12345678')}',     'name1@gmail.com',      'Quang',       'nguyen',         'https://dl.dropboxusercontent.com/s/3wicwhrw7e9fdvs/blob%20%2826%29.jpg?dl=0',             '15 Apr 1997',         false),  \
                          ( 'name2',       '${crypt('12345678')}',     'name2@gmail.com',     'Truong',       'nguyen',         'https://dl.dropboxusercontent.com/s/3wicwhrw7e9fdvs/blob%20%2826%29.jpg?dl=0',             '15 Apr 1997',         true), \
                          ( 'name3',       '${crypt('12345678')}',     'name3@gmail.com',     'Phuc',         'nguyen',         'https://dl.dropboxusercontent.com/s/3wicwhrw7e9fdvs/blob%20%2826%29.jpg?dl=0',             '15 Apr 1997',         false),  \
                          ( 'name4',       '${crypt('12345678')}',     'name4@gmail.com',     'Nghia',        'nguyen',         'https://dl.dropboxusercontent.com/s/3wicwhrw7e9fdvs/blob%20%2826%29.jpg?dl=0',             '15 Apr 1997',         false);`
    );
    pool.end();
}
module.exports = seed;