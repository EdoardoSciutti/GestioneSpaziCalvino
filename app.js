const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { authenticateToken, authenticateTokenRedirect } = require('./auth.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

//set di ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//cookie
app.use(cookieParser());

//routes
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/auth', require('./routes/login-signup'));

app.get('/', (req, res) => {
    res.render('../public/views/index.html');
});

app.get('/register', (req, res) => {
    res.render('../public/views/register.html');
});

app.get('/login', (req, res) => {
    res.render('../public/views/login.html');
});

app.get('/authSuccess', (req, res) => {
    res.render('../public/views/authSuccess.html');
});

app.get('/createBooking', authenticateTokenRedirect, (req, res) => {
    if (!req.user) {
        return res.render('../public/views/index.html');
    }
    res.render('../public/views/createBooking.html');
});

app.get('/deleteBooking', authenticateTokenRedirect, (req, res) => {
    if (res.statusCode === 401) {
        return res.render('../public/views/index.html');
    }
    res.render('../public/views/deleteBooking.html');
});

app.get('/forgotPassword', (req, res) => {
    res.render('../public/views/forgotPassword.html');
});

app.get('/changePassword', (req, res) => {
    res.render('../public/views/changePassword.html');
});

app.get('/passwordSuccess', (req, res) => {
    res.render('../public/views/passwordSuccess.html');
});

app.use('/styles', express.static(__dirname + '/public/styles'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));

app.listen(3000);
