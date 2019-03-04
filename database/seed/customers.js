const pool = require('../dbConnect');
async function seed() {
    await pool.query('TRUNCATE TABLE customers');
    await pool.query(
   "INSERT INTO customers( username,   password,   email) \
                 VALUES ( 'an',       '1234',     'an12345@gmail.com'),  \
                        ( 'an1',      '1234',     'an123458@gmail.com'), \
                        ( 'an2',      '1234',     'an123457@gmail.com'),  \
                        ( 'an3',      '1234',     'an123456@gmail.com');"
    );
    pool.end();
}
seed();