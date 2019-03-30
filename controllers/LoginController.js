const Controller = require('./Controller');
const User =  require('../models/User');

class LoginController extends  Controller{
    async login(request, response, username, password) {
        try {
            console.log('Login controller => login ', username, password);
            const result = await User.checkLogin(username, password);
            if (result) {
                delete result.password;
                request.session.user = result;
                response.json({...result})
            } else {
                response.status(401).end()
            }
        } catch (e) {
            response.status(503).end()
        }
    }
}
module.exports = new LoginController();