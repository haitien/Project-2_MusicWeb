const pool = require('../dbConnect');
const seed = async function () {
    await pool.query('TRUNCATE TABLE users');
    await pool.query(
        "INSERT INTO users( username,   password,   email,                   first_name,     last_name,      avatar,             date_of_birth,      is_admin) \
                  VALUES ( 'an',       '1234',     'an12345@gmail.com',     'an',         'nguyen',         'empty1',             '15 Apr 1997',         true),  \
                         ( 'an1',       '1234',     'an12345a@gmail.com',     'nam',         'nguyen',         'empty1',             '15 Apr 1997',         false), \
                         ( 'an2',       '1234',     'an12345b@gmail.com',     'quang',         'nguyen',         'empty1',             '15 Apr 1997',         false),  \
                         ( 'an3',       '1234',     'an12345c@gmail.com',     'binh',         'nguyen',         'empty1',             '15 Apr 1997',         false);"
    );
    pool.end();
}
module.exports = seed;