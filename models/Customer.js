const Model = require('./Model');
class Customer extends Model{
    constructor(){
        super('customers', 'user_id');
    }
}
module.exports = new Customer();