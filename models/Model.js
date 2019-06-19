const pool = require('../database/db-connect');

class Model {
    constructor(table, idColumn) {
        this.table = table;
        this.idColumn = idColumn;
    }

    async getAll() {
        const res = await pool.query(`SELECT * FROM ${this.table}`);
        return res;
    }

    async get(id) {
        console.log(`Model ${this.table} => get ${id}`);
        const res = await pool.query(`SELECT * FROM ${this.table} WHERE ${this.idColumn}='${id}';`)
        console.log('get', res[0]);
        return res[0];
    }
}

module.exports = Model;