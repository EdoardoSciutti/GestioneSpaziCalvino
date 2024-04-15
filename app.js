const express = require('express');
const app = express();

//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set di ejs
app.set('view engine', 'ejs');

//cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//routes
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/auth', require('./routes/login-signup'));

app.get('/', (req, res) => {
    res.render('../public/views/index.ejs');
})


app.listen(3000);