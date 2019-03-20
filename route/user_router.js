const express = require('express');
const multer = require('multer');
const upload = multer();
const UserController = require('../controllers/UserController');
// const upload = multer({dest: 'client/build/static/upload/'})
const router = express.Router();
router.use(function (req, res, next) {
    // if (req.session.user) {
    //     console.log(req.session.user)
    next();
    // } else {
    //     res.statusCode = 401
    //     res.json({error: 'unauthorized'})
    // }
});

router.get('/edit_profile', function (req, res) {
    let id = req.session.user ? req.session.user.id : '5';
    UserController.getUser(req, res, id);
});

module.exports = router;