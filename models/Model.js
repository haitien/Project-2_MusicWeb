const pool = require('../database/dbConnect');
class Model {
    constructor(table, idColumn){
        this.table = table;
        this.idColumn = idColumn;
    }
    async getAll(){
        const res = await pool.query(`SELECT * FROM ${this.table}`);
        pool.end();
        return res.rows;
    }
    async get(id) {
        const res = await pool.query(`SELECT * FROM ${this.table} WHERE ${this.idColumn} = ${id};`);
        pool.end();
        return res.rows;
    }
    async delete() {

    }
    
}
module.exports = Model;