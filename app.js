const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const authRouter = require('./routes/authRouthes');
const pictureRouter = require('./routes/picturesRouthes')
const commentsRouter = require('./routes/commentsRouthes');

const session = require('express-session');


app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'Galaxygram-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3 * 60 * 60 * 1000 } // 3 hours
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.isLoggedIn) {
        return res.redirect('/'); // Redirect to the index page if not logged in
    }
    next();
};


app.use('/auth', authRouter);
app.use('/pictures', requireLogin, pictureRouter);
app.use('/comments', requireLogin, commentsRouter);

module.exports = app;
