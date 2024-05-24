const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { authenticateToken } = require('../auth.js');
const express = require('express');
const passport = require('passport');
const { Users, Rooms, Roles, Bookings, UserRoles, Email_verifications, Password_recovery } = require('../sequelize/model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');

//recupero passwors

//file con il middleware per il token

//di base
const router = express.Router();

//modelli sql

//.env
require('dotenv').config();

//bcript

//get delle pagine login e signup
router.get('/login', async (req, res) => {
  res.render('../public/views/login.ejs');
});

//jwt

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
  const { email, password, name, surname } = req.body;
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
          res.status(201).json({ success: true, message: 'User created' });
        } else {
          res.status(400).json({ success: false, message: 'User already exists' });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/forgotPassword', async (req, res) => {
  const user = await Users.findOne({ where: { email: req.body.email } });
  if (!user) {
    return res.status(400).json({ error: 'Email not found' });
  }
  const token = crypto.randomBytes(20).toString('hex');
  Password_recovery.findOrCreate({
    where: {
      user_id: user.user_id
    },
    defaults: {
      token: token
    }
  }).then(([password_recovery, created]) => {
    if (!created) {
      password_recovery.token = token;
      password_recovery.save();
    }
  });

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'no-reply@example.com',
    to: user.email,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
      http://localhost:3000/api/auth/reset/${token} \n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.error('there was an error: ', err);
    } else {
      res.status(200).json('recovery email sent');
    }
  });
});

// Endpoint per reimpostare la password
router.get('/reset/:token', async (req, res) => {
  const { token } = req.params;
  console.log(token);
  try {
    // Trova la verifica email associata a questo token
    const password_recovery = await Password_recovery.findOne({
      where: { token: token }
    });

    if (!password_recovery) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    const user_id = password_recovery.dataValues.user_id;
    const change_password_token = jwt.sign({ 'user_id': user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
    res.cookie('change_password_token', change_password_token, { expiresIn: '30m', httpOnly: true });

    // Rimuovi il record
    await password_recovery.destroy();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.redirect('/changePassword');
});

router.post('/reset', async (req, res) => {

  jwt.verify(req.cookies.change_password_token, process.env.ACCESS_TOKEN_SECRET, async function (err, user) {
    if (err) {
      return res.status(400).json({ success: false, message: 'Invalid cookie' });
    }

    const utente = await Users.findOne({
      where: {
        user_id: user.user_id,
      }
    });

    console.log(utente);

    if (!utente) {
      return res.status(400).json({ error: 'User not found.' });
    }
    bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS_SECRET), (err, hash) => {
      if (err)  return res.status(500).json({ error: err.message });
      utente.password = hash;
      utente.save();
    });
  });
  res.status(200).json({ message: 'Password has been updated' });
});


router.get('/verifyEmail/:token', async (req, res) => {
  const { token } = req.params;
  try {
    // Trova la verifica email associata a questo token
    const emailVerification = await Email_verifications.findOne({
      where: { token: token },
      include: [{
        model: Users,
        required: true
      }]
    });

    if (!emailVerification) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Imposta il campo is_verified su true
    emailVerification.user.is_verified = true;
    emailVerification.destroy();
    await emailVerification.save();
    await emailVerification.user.save();

    res.redirect('/authSuccess');

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
      } else if (user.is_verified == false) {
        res.status(402).json({ success: false, message: 'L\'user non è verificato.' });
      } else {
        console.log(user);
        bcrypt.compare(dati.password, user.password, function (_, result) {
          if (result) {
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
            res.status(200).json({ success: true, message: 'L\'user esiste.' });
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

router.get('/googleAuth', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/googleCallback',
  passport.authenticate('google',
    {
      failureRedirect: `http://localhost:3000/api/auth/googleFailure`,
      successRedirect: `http://localhost:3000/api/auth/googleSuccess`
    })
);

router.get('/googleSuccess', (req, res) => {
  const user_for_token = { email: req.user.email, id: req.user.user_id };
  const access_token = jwt.sign(user_for_token, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 86400 // scade in 24 ore
  });
  const refresh_token = jwt.sign(user_for_token, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: 86400 * 7 // scade in 7 giorni
  });
  res.cookie('access_token', access_token, { httpOnly: true });
  res.cookie('refresh_token', refresh_token, { httpOnly: true });
  res.redirect('http://localhost:3000/');
});

router.get('/googleFailure', (req, res) => {
  res.status(401).json({ success: false, message: 'User not logged with google' });
});

router.get('/isLogged', authenticateToken, (req, res) => {
  res.status(200).json({ success: true, message: 'User logged' });
});

router.get('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.status(200).json({ success: true, message: 'User logged out' });
});

module.exports = router;
