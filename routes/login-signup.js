
const {authenticateToken} = require('../auth.js')
//di base
const express = require('express')
const router = express.Router()

//modelli sql
const { Users, Rooms, Roles, Bookings, UserRoles } = require('../sequelize/model.js')

//.env
require('dotenv').config();

//bcript
const bcrypt = require('bcrypt');

//get delle pagine login e signup
router.get('/login', async(req, res) => {
    res.render('../public/views/login.ejs');
});

//jwt
const jwt = require('jsonwebtoken');

router.get('/signup', (req, res) => {
    res.render('../public/views/signup.ejs');
});

/*
    Description: register a new user
    Path: http://localhost:3000/api/auth/register
    Method: POST
    Response: a message that confirms the registration
    Requirement: email, password, name, surname (all in the body)
 */
router.post('/register', (req, res) => {
  const { email, password, name, surname } = req.body
  try {
    bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS_SECRET), (err, hash) => {
      if (err) 
        return res.status(500).json({ error: err.message });  
      Users.findOrCreate({
        where: {
          email: email,
        },
        defaults: {
          password: hash,
          name: name,
          surname: surname
        }
      }).then(([user, created]) => {
        if (created) {
          const user_for_token = { email: user.email, id: user.user_id };
          const access_token = jwt.sign(user_for_token, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
          const refresh_token = jwt.sign(user_for_token, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
          res.cookie('access_token', access_token, { httpOnly: true });
          res.cookie('refresh_token', refresh_token, { httpOnly: true });
          res.status(201).json({success : true, message: 'User created'});
        } else {
          res.status(400).json({success : false, message: 'User already exists'});
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
    Description: login a user
    Path: http://localhost:3000/api/auth/login
    Method: POST
    Response: a message that confirms the login and a cookie with the access and refresh token
    Requirement: email, password (all in the body)
 */
router.post('/login', (req, res) => {
  const dati = req.body;
  Users.findOne({
    where: {
      email: dati.email
    },
  })
    .then((user) => {
      if (user == null) {
        res.status(404).json({ success: false, message: 'L\'user non esiste.' });
      } else {
        console.log(user);
        bcrypt.compare(dati.password, user.password, function(_, result) {
          if(result) {
            // Le password corrispondono
            const user_for_token = { email: user.email, id: user.user_id };
            const access_token = jwt.sign(user_for_token, process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: 86400 // scade in 24 ore
            });
            const refresh_token = jwt.sign(user_for_token, process.env.REFRESH_TOKEN_SECRET, {
              expiresIn: 86400 * 7 // scade in 7 giorni
            });
            res.cookie('access_token', access_token, { httpOnly: true });
            res.cookie('refresh_token', refresh_token, { httpOnly: true });
            res.status(200).json({ success: true, message: 'L\'user esiste.'});
          } else {
            // Le password non corrispondono
            res.status(401).json({ success: false, message: 'Password errata.' });
          }
        });
      }
    })
    .catch((error) => {
      res.status(500).send('Internal Server Error', 'errore:', error);
      console.log(error);
    });
});



router.get('/isLogged', authenticateToken, (req, res) => {
  res.status(200).json({ success: true, message: 'User logged' });
});

router.get('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.status(200).json({ success: true, message: 'User logged out' });
});


module.exports = router