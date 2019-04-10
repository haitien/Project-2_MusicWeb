const express = require('express');
const multer = require('multer');
const API = require('../js/api_constants');
const upload = multer();
// const upload = multer({dest: 'views/build/static/upload/'})
const UserController = require('../controllers/UserController');
const LoginController = require('../controllers/LoginController');
const router = express.Router();

router.use((request, response, next) => {
    if (request.session.user && !request.session.user.is_admin) {
        next();
    } else {
        response.status(401).end()
    }
});

router.get(API.EDIT_PROFILE, (request, response) => {
    UserController.getUser(request, response, request.session.user.id);
});

router.post(API.LOGOUT, (request, response) => {
    request.session.user = null;
    response.end()
});

router.get(API.IS_USER, (request, response) => {
    response.json({...request.session.user});
});

router.post(API.EDIT_PROFILE, upload.single('avatar'), (request, response) => {
    UserController.editUser(request, response)
});

router.post(API.CHECK_PASSWORD, (request, response) => {
    UserController.checkPassword(request, response, request.session.user.username, request.body.password)
});

module.exports = router;