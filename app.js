const express = require('express');
const app = express();
var session = require('express-session')

//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.listen(3000);