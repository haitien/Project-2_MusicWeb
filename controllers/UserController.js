const Controller = require('./Controller.js');
const User = require('../models/User');

const usernameRegex = /^[a-z0-9_-]{3,16}$/;
const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm;
const passwordRegex = /(?=.{8,})/;
const nameRegex = /^(?!\s*$).+/;
const defaultAvatar = 'https://dl.dropboxusercontent.com/s/l32nmhbq8wkkj47/avatar.png?dl=0';


class UserController extends Controller {
    async validateData(req, res, data) {
        if (data.username) {
            const result = await User.checkUsernameExist(data.username);
            res.json({username: result});
            return
        }
        if (data.email) {
            const result = await User.checkEmailExist(data.email);
            res.json({email: result});
        }
    }
    async getUser(req, res, id) {
        const result = await User.getUser(id);
        if (result) {
            res.json(result)
        }
    }
    async addUser(req, res) {
        console.log('User controller addUser()');
        const usernameError = !usernameRegex.test(req.body.username);
        const usernameExist = await User.checkUsernameExist(req.body.username);
        const emailExist = await User.checkEmailExist(req.body.email);
        const emailError = !emailRegex.test(req.body.email);
        const passwordError = !passwordRegex.test(req.body.password);
        const firstNameError = !nameRegex.test(req.body.first_name);
        const lastNameError = !nameRegex.test(req.body.last_name);
        const date = Date.parse(req.body.birthday);
        const birthdayError = !date || date >= Date.now();
        const valid = !usernameError && !usernameExist && !emailExist && !emailError && !passwordError && !firstNameError && !lastNameError && !birthdayError;
        console.log('addUser check validate' + valid);
        if (valid) {
            let url = defaultAvatar;
            try {
                if (req.file) {
                    const res1 = await this.uploadImageFile(req.file);
                    url = res1.url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
                    console.log('upload avatar' + url)
                }
            } catch (e) {
                console.log('upload error');
                console.log(e);
                res.json({result: false, error: e});
                return
            }
            req.body.avatar = url;
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let current_datetime = new Date(date);
            req.body.birthday = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear();
            console.log('AddUser before postgres sql');
            console.log(req.body);
            try {
                const result = await User.addUser(req);
                res.json({result: true});
                console.log('addUser sql success')
            } catch (e) {
                console.log('addUser sql error');
                console.log(e);
                res.json({result: false, error: e})
            }
        } else {
            res.json({
                result: false,
                usernameError: usernameError,
                usernameExist: usernameExist,
                emailExist: emailExist,
                emailError: emailError,
                passwordError: passwordError,
                firstNameError: firstNameError,
                lastNameError: lastNameError,
                birthdayError: birthdayError
            })
        }
    }

    async uploadImageFile(file) {
        const fileName = this.addFileExtension(file);
        let path = '/image/' + fileName;
        const fetch = require('isomorphic-fetch');
        const Dropbox = require('dropbox').Dropbox;
        const dbx = new Dropbox({
            accessToken: 'wXLQd5nNy4AAAAAAAAAAEGey-alEMw-sjQJgEjL07M9zsZtotxqGBqc1f-ACSVaY',
            fetch: fetch
        });
        let res = await dbx.filesUpload({
            path: path,
            mode: "add",
            autorename: true,
            mute: false,
            strict_conflict: false,
            contents: file.buffer
        });
        const path_display = res.path_display;

        const res1 = dbx.sharingCreateSharedLinkWithSettings({
            path: path_display,
            settings: {requested_visibility: 'public'}
        });

        return res1

    }
    async deleteImageFile (filePath){
        const fetch = require('isomorphic-fetch');
        const Dropbox = require('dropbox').Dropbox;
        const dbx = new Dropbox({
            accessToken: 'wXLQd5nNy4AAAAAAAAAAEGey-alEMw-sjQJgEjL07M9zsZtotxqGBqc1f-ACSVaY',
            fetch: fetch
        });
        console.log(filePath);
        let res = await dbx.filesDeleteV2({
            path: filePath,
        });
    }


    addFileExtension(file) {
        if (file.mimetype === 'image/jpeg' && !file.originalname.endsWith('.jpg')) {
            return file.originalname + '.jpg'
        }
        if (file.mimetype === 'image/png' && !file.originalname.endsWith('.png')) {
            return file.originalname + '.png'
        }
        return file.originalname
    }
    async editUser(req, res) {
        // console.log(req.body)
        // console.log(req.file)
        console.log('User controller editUser()');

        const emailError = !emailRegex.test(req.body.email);
        const firstNameError = !nameRegex.test(req.body.first_name);
        const lastNameError = !nameRegex.test(req.body.last_name);
        const passwordError = req.body.password && !passwordRegex.test(req.body.password);
        const date = Date.parse(req.body.birthday);
        const birthdayError = !date || date >= Date.now();
        const valid =!emailError && !passwordError && !firstNameError && !lastNameError && !birthdayError;
        console.log('editUser check validate ' + valid);
        // console.log(req.file)
        if (valid) {
            if (req.file) {
                try {
                    const res1 = await this.uploadImageFile(req.file);
                    const url = res1.url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
                    console.log('upload avatar' + url);
                    req.body.avatar = url
                } catch (e) {
                    console.log('upload error');
                    console.log(e);
                    res.json({result: false, error: e});
                    return
                }
            }
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let current_datetime = new Date(date);
            req.body.birthday = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear();
            console.log('EditUser before postgres sql');
            console.log(req.body);
            try {
                const result = await User.editUser(req);
                res.json({result: true});
                console.log('editUser sql success')
            } catch (e) {
                console.log('editUser sql error');
                console.log(e);
                res.json({result: false, error: e})
            }
        } else {
            res.json({
                result: false
            })
        }

    }
}

module.exports = new UserController();