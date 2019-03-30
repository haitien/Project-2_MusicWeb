const Model = require('./Model');
const pool = require('../database/dbConnect');
const Utils = require('../js/utils');
const bcrypt = require('bcrypt');

class User extends Model {
    constructor() {
        super('users', 'id')
    }

    async getUser(id) {
        console.log('Model user => get ', id);
        const res = await pool.query(`SELECT * FROM ${this.table} WHERE id='${id}';`);
        return res.rows[0];
    }

    async checkLogin(username, password) {
        console.log('Model user => checkLogin ', username, password);
        const result = await pool.query(`SELECT * FROM ${this.table} WHERE username='${username}';`);
        if (result.rows.length !== 1) return null;
        if (!bcrypt.compareSync(password, result.rows[0].password)) {
            return null;
        }
        return result.rows[0];
    }

    async checkUsernameExist(username) {
        console.log('Model user => checkUsernameExist ', username);
        const result = await pool.query(`SELECT * FROM ${this.table} WHERE username='${username}';`);
        return result.rows.length > 0
    }

    async checkEmailExist(email) {
        console.log('Model user => checkEmailExist ', email);
        const result = await pool.query(`SELECT * FROM ${this.table} WHERE email='${email}';`);
        return result.rows.length > 0
    }

    async addUser(request) {
        console.log('Model user => add user ', request.body);
        const crypt = Utils.bcrypt;
        const {username, email, password, first_name, last_name, avatar, birthday} = request.body;
        const result = await pool.query(
            `INSERT INTO users( username,  password,            email,      first_name,      last_name,       avatar,     date_of_birth, is_admin) \
                   VALUES ( '${username}', '${crypt(password)}','${email}', '${first_name}', '${last_name}', '${avatar}', '${birthday}', false)  \
                   RETURNING id, username, email, first_name, last_name, avatar, date_of_birth, is_admin;`);
        return result;
    }

    async editUser(request) {
        console.log('Model user => edit user ', request.body);
        const {username, email, new_password, first_name, last_name, avatar, birthday} = request.body;
        let query = `UPDATE users \
         SET email = '${email}', first_name='${first_name}', last_name='${last_name}', date_of_birth='${birthday}'`;
        if (avatar) query += `, avatar ='${avatar}' `;
        if (new_password) query += `, password ='${bcrypt(new_password)}' `;
        query += ` WHERE username='${username}' RETURNING id, username, email, first_name, last_name, avatar, date_of_birth, is_admin; `;
        const result = await pool.query(query);
        return result;
    }
}

module.exports = new User();