const express = require('express')
const multer = require('multer')
const upload = multer()
// const upload = multer({dest: 'client/build/static/upload/'})
const LoginController = require('../controllers/LoginController')
const UserController = require('../controllers/UserController')
const router = express.Router()
router.use(function(req, res, next) {
   next();
});
router.post('/login', function (req, res) {
   // console.log( req.protocol + '://' + req.get('host') )
   LoginController.login(req, res, req.body.username, req.body.password)
});
router.get('/is-logged', function (req, res) {
   if (req.session.user) {
      res.json({id: req.session.user.id, name: req.session.user.first_name, admin: req.session.user.is_admin})
   } else res.json({id: null})
})
router.get('/logout', function (req, res) {
   if (req.session.user) {
      req.session.user = null
      res.json({result: true})
      return
   }
   res.json({result: false})
})
router.post('/register', upload.single('avatar'), function (req, res) {
   UserController.addUser(req, res)
});
router.post('/register/validate', function (req, res) {
   UserController.validateData(req, res, req.body)
});
module.exports =  router;