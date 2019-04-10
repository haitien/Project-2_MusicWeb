const Controller = require('./Controller');
const User = require('../models/User');
const validator = require('validator');
const AppConstant = require('../js/app_constants');
const Utils = require('../js/utils');


class UserController extends Controller {
    async validateData(request, response, data) {
        try {
            console.log('User controller => validateData', data);
            const {username, email} = data;
            if (username) {
                const result = await User.checkUsernameExist(username);
                response.json({result: result});
                return
            }
            if (email) {
                const result = await User.checkEmailExist(email);
                response.json({result: result});
                return
            }
            response.end()
        } catch (e) {
            response.end()
        }
    }

    async checkPassword(request, response, username, password) {
        try {
            console.log('User controller => checkPassword', username, password);
            const result = await User.checkLogin(username, password);
            response.json({result: !!result});
        } catch (e) {
            response.status(503).end();
        }
    }

    async getUser(req, response, id) {
        try {
            console.log('User controller => get user', id);
            const result = await User.getUser(id);
            if (result) {
                response.json(result)
            } else {
                response.status(401).end();
            }
        } catch (e) {
            response.status(503).end();
        }
    }

    async addUser(request, response) {
        console.log('UserController => add user', request.body);
        const {username, email, password, first_name, last_name, birthday} = request.body;
        try {
            const usernameValid = AppConstant.REGEX_USERNAME.test(username);
            const usernameExist = await User.checkUsernameExist(username);
            const emailExist = await User.checkEmailExist(email);
            const emailValid = validator.isEmail(email);
            const passwordValid = AppConstant.REGEX_PASSWORD.test(password);
            const firstNameValid = AppConstant.REGEX_NAME.test(first_name);
            const lastNameValid = AppConstant.REGEX_NAME.test(last_name);
            const birthdayValid = validator.isBefore(birthday);
            const valid = usernameValid && !usernameExist && !emailExist && emailValid && passwordValid && firstNameValid && lastNameValid && birthdayValid;
            console.log('Add user check validate ', valid);
            if (!valid) {
                response.status(503).end();
                return;
            }
        } catch (e) {
            response.status(503).end();
            return;
        }
        let url = AppConstant.AVATAR_URL;
        try {
            if (request.file) {
                const res1 = await Utils.uploadImageFile(request.file);
                url = Utils.convertLinkDropbox(res1.url);
                console.log('Upload avatar', url)
            }
        } catch (e) {
            console.log('Upload error', e);
            response.status(503).end();
            return
        }
        request.body.avatar = url;
        request.body.birthday = Utils.convertToDDMMMYYY(birthday);
        console.log('Add user before postgres sql', request.body);
        try {
            const result = await User.addUser(request);
            request.session.user = result.rows[0];
            response.json({...result.rows[0]});
            console.log('Add user sql success ', result.rows[0])
        } catch (e) {
            console.log('Add user sql error', e);
            response.status(503).end();
        }
    }

    async editUser(request, response) {
        console.log('User controller => editUser', request.body);
        const {username, avatar} = request.session.user;
        const {email, old_password, new_password, first_name, last_name, birthday} = request.body;
        try {
            const emailValid = validator.isEmail(email);
            const firstNameValid = AppConstant.REGEX_NAME.test(first_name);
            const lastNameValid = AppConstant.REGEX_NAME.test(last_name);
            const birthdayValid = validator.isBefore(birthday);
            let passwordValid = true;
            if (old_password && new_password) {
                passwordValid = AppConstant.REGEX_PASSWORD.test(new_password) && User.checkLogin(username, old_password);
            } else {
                delete request.body.new_password;
            }
            const valid = emailValid && firstNameValid && lastNameValid && birthdayValid && passwordValid;
            console.log('Edit user check validate ', valid);
            if (!valid) {
                response.status(503).end();
                return;
            }
        } catch (e) {
            response.status(503).end();
            return;
        }
        try {
            if (request.file) {
                const res1 = await Utils.uploadImageFile(request.file);
                const url = Utils.convertLinkDropbox(res1.url);
                try {
                    console.log('Delete avatar ', avatar);
                    Utils.deleteImageFile(avatar);
                } catch (e) {
                    //  nothing to do
                }
                console.log('Upload avatar ', url);
                request.body.avatar = url
            } else {
                delete request.body.avatar;
            }
        } catch (e) {
            console.log('Upload error', e);
            response.status(503).end();
            return
        }
        request.body.username = username;
        request.body.birthday = Utils.convertToDDMMMYYY(birthday);
        console.log('Edit user before postgres sql', request.body);
        try {
            const result = await User.editUser(request);
            request.session.user = result.rows[0];
            response.json({...result.rows[0]});
            console.log('Edit user sql success ', result.rows[0]);
        } catch (e) {
            console.log('Edit user sql error', e);
            response.status(503).end();
        }
    }
}

module.exports = new UserController();