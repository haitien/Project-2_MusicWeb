const express = require('express');
const multer = require('multer');
const upload = multer();
const UserController = require('../controllers/UserController');
const LoginController = require('../controllers/LoginController');
// const upload = multer({dest: 'client/build/static/upload/'})
const router = express.Router();

router.use(function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.statusCode = 401;
        res.json({error: 'unauthorized'})
    }
});

router.get('/edit_profile', function (req, res) {
    UserController.getUser(req, res, req.session.user.id);
});

router.post('/edit_profile', upload.single('avatar'), function (req, res) {
    UserController.editUser(req, res)
});

router.post('/check_password', function (req, res) {
    LoginController.login(req, res, req.body.username, req.body.password)
});

module.exports = router;