const pool = require('../database/dbConnect');
class Model {
    constructor(table, idColumn){
        this.table = table;
        this.idColumn = idColumn;
    }
    async getAll(){
        const res = await pool.query(`SELECT * FROM ${this.table}`);
        return res.rows;
    }
    
}
module.exports = Model;