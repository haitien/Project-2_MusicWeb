const mysql = require('mysql');
require('dotenv').config();
const util = require('util');
const connectionHost = process.env.DB_HOST;
const connectionDb = process.env.DB_DATABASE;
const connectionUser = process.env.DB_USERNAME;
const connectionPass = process.env.DB_PASSWORD;
const pool = mysql.createPool({
    connectionLimit: 10,
    host: connectionHost,
    user: connectionUser,
    password: connectionPass,
    database: connectionDb
});

pool.query = util.promisify(pool.query);

module.exports = pool;
