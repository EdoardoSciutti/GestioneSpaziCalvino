const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');

//body parser
const bodyParser = require('body-parser');
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
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//routes
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/auth', require('./routes/login-signup'));

app.get('/', (req, res) => {
    res.render('../public/views/index.html');
})

app.get('/register', (req, res) => {
    res.render('../public/views/register.html');
})

app.get('/login', (req, res) => {
    res.render('../public/views/login.html');
})

app.get('/authSuccess', (req, res) => {
    res.render('../public/views/authSuccess.html');
})

app.get('/createBooking', (req, res) => {
    res.render('../public/views/createBooking.html');
})

app.get('/deleteBooking', (req, res) => {
    res.render('../public/views/deleteBooking.html');
})

app.use('/styles', express.static(__dirname + '/public/styles'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));

app.listen(3000);