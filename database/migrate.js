//this file use for create tables in postgres SQL

const pool = require('./dbConnect');
async function migrate() {
    await pool.query('DROP TABLE IF EXISTS customers, employees');

    // tutorial for create table  postgresqltutorial.com/postgresql-create-table
    // just example
    await pool.query('CREATE TABLE customers( \
        user_id serial PRIMARY KEY, \
        username VARCHAR (50) UNIQUE NOT NULL, \
        password VARCHAR (50) NOT NULL, \
        email VARCHAR (355) UNIQUE NOT NULL)');
    await pool.query('CREATE TABLE employees( \
        role_id serial PRIMARY KEY, \
        role_name VARCHAR (255) UNIQUE NOT NULL)');

    // create more tale here

    pool.end();
}
migrate();