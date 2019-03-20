const Model = require('./Model.js');
const pool = require('../database/dbConnect');
const bcrypt = require('bcrypt');

function crypt(password) {
    return bcrypt.hashSync(password, 10);
}

class User extends Model {
    constructor() {
        super('users', 'id')
    }

    async getUser(id) {
        const res = await pool.query(`SELECT * FROM ${this.table} WHERE id='${id}';`);
        return res.rows[0];
    }

    async checkLogin(username, password) {
        const res = await pool.query(`SELECT * FROM ${this.table} WHERE username='${username}';`);
        if (res.rows.length !== 1) return null;
        if (!bcrypt.compareSync(password, res.rows[0].password)) {
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
                   VALUES ( '${d.username}',        '${crypt(d.password)}',     '${d.email}',      '${d.first_name}',        '${d.last_name}',      '${d.avatar}',        '${d.birthday}',       false)  RETURNING id; `);
        return res;
    }

    async editUser(req) {
        const r = req.body;
        let query = `UPDATE users \
         SET email = '${r.email}', first_name='${r.first_name}', last_name='${r.last_name}', date_of_birth='${r.birthday}'`;
        if (r.avatar != 'null') query += `, avatar ='${r.avatar}' `;
        if (r.password) query += `, password ='${crypt(r.password)}' `;
        query += ` WHERE username='${r.username}'; `;
        console.log(query);
        const res = await pool.query(query);
        return res;
    }
}

module.exports = new User();