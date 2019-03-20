const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 5000;
const FileStore = require('session-file-store')(session);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    // resave: false,
    // saveUninitialized: true,
    store: new FileStore(),
    secret: 'this-is-a-secret-token-1',
    cookie: { maxAge: 600*1000 }
}));

const user_router = require('./route/user_router.js');
app.use('/api/user', user_router);
// API calls
const router = require('./route/router.js');
app.use('/api', router);


app.use(express.static(path.join(__dirname, 'public')));
if (process.env.NODE_ENV === "production") {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));