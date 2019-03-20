const express = require('express');
const multer = require('multer');
const upload = multer();
// const upload = multer({dest: 'client/build/static/upload/'})
const LoginController = require('../controllers/LoginController');
const UserController = require('../controllers/UserController');
const router = express.Router();

router.use(function(req, res, next) {
   next();
});
// console.log( req.protocol + '://' + req.get('host') )


router.post('/login', function (req, res) {
   LoginController.login(req, res, req.body.username, req.body.password)
});

router.get('/is_login', function (req, res) {
   if (req.session.user) {
      res.json({...req.session.user})
   } else {
      res.json(null);
   }
});

router.get('/logout', function (req, res) {
   LoginController.logout(req, res)
});

router.post('/register', upload.single('avatar'), function (req, res) {
   UserController.addUser(req, res)
});

router.post('/register/validate', function (req, res) {
   UserController.validateData(req, res, req.body)
});

router.get('/session', function (req, res) {
   console.log(req.session);
   console.log(req.session.user);
});
module.exports =  router;