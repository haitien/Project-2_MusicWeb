const Controller = require('./Controller.js');
const User =  require('../models/User.js');
class LoginController extends  Controller{
    async login(req, res, username, password) {
        const result = await User.checkLogin(username, password);
        if (result) {
            req.session.user = result;
            res.json({result: true})
        } else {
            res.json({result: false})
        }
    }
    logout(req, res) {
        if (req.session.user) {
           req.session.user = null;
           res.json({result: true});
           return
        }
        res.json({result: false})
    }
}
module.exports = new LoginController();