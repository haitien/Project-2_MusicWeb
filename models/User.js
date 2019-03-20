const Model = require('./Model.js');
const pool = require('../database/dbConnect');
const bcrypt = require('bcrypt');
function crypt(password) {
    return bcrypt.hashSync(password, 10);
}
class User extends Model{
    constructor() {
        super('users', 'id')
    }

    async getUser(id) {
        const res = await pool.query(`SELECT * FROM ${this.table} WHERE id='${id}';`);
        // pool.end();
        return res.rows[0];
    }
    async checkLogin(username, password) {
        const res = await pool.query(`SELECT * FROM ${this.table} WHERE username='${username}';`);
        // pool.end();
        if (res.rows.length !== 1) return null;
        if(!bcrypt.compareSync(password, res.rows[0].password)) {
            return null;
        }
        delete res.rows[0].password;
        return res.rows[0];
    }
    async checkUsernameExist(username) {
        const res = await pool.query(`SELECT * FROM ${this.table} WHERE username='${username}';`);
        if (res.rows.length > 0) {
            return true
        }
        return false
    }
    async checkEmailExist(email) {
        const res = await pool.query(`SELECT * FROM ${this.table} WHERE email='${email}';`);
        if (res.rows.length > 0) {
            return true
        }
        return false
    }
    async addUser(req) {
        const d = req.body;
        const res = await pool.query(
       `INSERT INTO users( username,                password,                    email,             first_name,             last_name,              avatar,               date_of_birth,        is_admin) \
                   VALUES ( '${d.username}',        '${crypt(d.password)}',     '${d.email}',      '${d.first_name}',        '${d.last_name}',      '${d.avatar}',        '${d.birthday}',       false);`);
        return res
    }
}
module.exports = new User();