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

router.post('/login', (req, res) => {
  const dati = req.body;
  Users.findOne({
    where: {
      email: dati.email
    },
  })
    .then((user) => {
      if (user == null) {
        res.status(200).json({ success: false, message: 'L\'user non esiste.' });
      } else {
        console.log(user);
        bcrypt.compare(dati.password, user.password, function(err, result) {
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
            res.status(200).json({ success: false, message: 'Password errata.' });
          }
        });
      }
    })
    .catch((error) => {
      res.status(500).send('Internal Server Error', 'errore:', error);
      console.log(error);
    });
});


module.exports = router