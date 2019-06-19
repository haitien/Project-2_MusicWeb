const Model = require('./Model');
const pool = require('../database/db-connect');
const Utils = require('../core/utils');
const bcrypt = require('bcrypt');

class User extends Model {
    constructor() {
        super('users', 'id')
    }

    async checkLogin(username, password) {
        console.log('Model user => checkLogin ', username, password);
        const result = await pool.query(`SELECT * FROM ${this.table} WHERE username='${username}';`);
        if (result.length !== 1) {
            return null;
        }
        if (!bcrypt.compareSync(password, result[0].password)) {
            return null;
        }
        return result[0];
    }

    async checkUsernameExist(username) {
        console.log('Model user => checkUsernameExist ', username);
        const result = await pool.query(`SELECT * FROM ${this.table} WHERE username='${username}';`);
        return result.length > 0;
    }

    async checkEmailExist(email) {
        console.log('Model user => checkEmailExist ', email);
        const result = await pool.query(`SELECT * FROM ${this.table} WHERE email='${email}';`);
        return result.length > 0;
    }

    async addUser(request) {
        console.log('Model user => add user ', request.body);
        const crypt = Utils.bcrypt;
        const {username, email, password, first_name, last_name, avatar, birthday} = request.body;
        await pool.query(
            `INSERT INTO users( username,  password,            email,      first_name,      last_name,       avatar,     birthday, is_admin) \
                   VALUES ( '${username}', '${crypt(password)}','${email}', '${first_name}', '${last_name}', '${avatar}', '${birthday}', false);`);
        const newUser = await pool.query('SELECT * FROM users WHERE id=LAST_INSERT_ID();');
        console.log(`INSERT INTO users( username,  password,            email,      first_name,      last_name,       avatar,     birthday, is_admin) \
                   VALUES ( '${username}', '${crypt(password)}','${email}', '${first_name}', '${last_name}', '${avatar}', '${birthday}', false);`)
        return newUser[0];
    }

    async editUser(request) {
        console.log('Model user => edit user ', request.body);
        const {username, email, new_password, first_name, last_name, avatar, birthday} = request.body;
        let query = `UPDATE users SET email = '${email}', first_name='${first_name}', last_name='${last_name}', birthday='${birthday}'`;
        if (avatar) {
            query += `, avatar ='${avatar}' `;
        }
        if (new_password) {
            query += `, password ='${Utils.bcrypt(new_password)}' `;
        }
        query += ` WHERE username='${username}'; `;
        await pool.query(query);
        const result = await pool.query(`SELECT * from users where username='${username}';`);
        return result[0];
    }
}

module.exports = new User();