const express = require('express');
const multer = require('multer');
const API = require('../js/api_constants');
const upload = multer();
// const upload = multer({dest: 'views/build/static/upload/'})

const router = express.Router();

router.use((request, response, next) => {
    if (request.session.user && request.session.user.is_admin) {
        next();
    } else {
        response.status(401).end();
    }
});
router.get(API.IS_ADMIN, (request, response) => {
    response.json({...request.session.user});
});

module.exports = router;