const express = require('express');
const multer = require('multer');
const upload = multer();
// const upload = multer({dest: 'views/build/static/upload/'})
const LoginController = require('../controllers/LoginController');
const UserController = require('../controllers/UserController');
const router = express.Router();
const API = require('../js/api_constants');

router.use(function(request, response, next) {
   next();
});
// console.log( req.protocol + '://' + req.get('host') )


router.post(API.LOGIN,(request, response) => {
   LoginController.login(request, response, request.body.username, request.body.password)
});

router.post(API.REGISTER, upload.single('avatar'), (request, response) => {
   UserController.addUser(request, response)
});

router.post(API.VALIDATE, (request, response) => {
   UserController.validateData(request, response, request.body)
});

router.get(API.SESSION, function (request, response) {
   console.log('Current session', request.session.cookie._expires,' user:', request.session.user);
   response.end()
});
module.exports =  router;