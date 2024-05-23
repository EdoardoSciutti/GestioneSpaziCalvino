//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Users, Rooms, Roles, Bookings, UserRoles } = require('./sequelize/model.js')

//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

// ...

//   +-------------------------------------------------+
//   |   We create the functions we are gonna export   |
//   +-------------------------------------------------+

// verify the token and redirect to login if it is not valid
function authenticateToken(req, res, next) {
    const {access_token} = req.cookies; // Leggi il token dal cookie
    const { refresh_token } = req.cookies; // Leggi il refresh token dal cookie
    console.log('token: ', access_token);
    if (access_token == null){
      // Invia solo una risposta
      if (refresh_token == null) return res.status(401).json({ success: false, message: 'Token not found' });
      jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err){
          return res.status(401).json({ success: false, message: 'Dated token' });
        }
        const access_token = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' }); // Genera un nuovo access token
        const refresh_token = jwt.sign({ name: user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Genera un nuovo refresh token
        res.cookie('access_token', access_token, { httpOnly: true }); // Invia il nuovo access token come cookie
        res.cookie('refresh_token', refresh_token, { httpOnly: true }); // Invia il nuovo refresh token come cookie
        console.log('token refreshed');
        req.user = user;
        return next(); // Passa al prossimo middleware
      });
    } else {
      jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          console.log(err);
          if (refresh_token == null){
            return res.status(401).json({ success: false, message: 'Token not found' });
          }
          jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err){
              return res.status(401).json({ success: false, message: 'Dated token' });
            }
            req.user = user;
            return next(); // passa al prossimo middleware
          });
        } else {
          req.user = user;
          return next(); // passa al prossimo middleware
        }
      });
    }
}

function authenticateTokenRedirect(req, res, next) {
    const {access_token} = req.cookies; // Leggi il token dal cookie
    const { refresh_token } = req.cookies; // Leggi il refresh token dal cookie
    console.log('token: ', access_token);
    if (access_token == null){
      // Invia solo una risposta
      return res.redirect('/');
    }
    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        if (refresh_token == null){
          return res.redirect('/');
        }
        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if (err){
            return res.redirect('/');
          }
          const access_token = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' }); // Genera un nuovo access token
          const refresh_token = jwt.sign({ name: user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Genera un nuovo refresh token
          res.cookie('access_token', access_token, { httpOnly: true }); // Invia il nuovo access token come cookie
          res.cookie('refresh_token', refresh_token, { httpOnly: true }); // Invia il nuovo refresh token come cookie
          console.log('token refreshed');
          req.user = user;
          next(); // Passa al prossimo middleware
      });
      }
      req.user = user;
      next(); // passa al prossimo middleware
    });
}


passport.use(new GoogleStrategy(
  {
      clientID:     googleClientId,
      clientSecret: googleClientSecret,
      //change this path to newest
      callbackURL: `http://localhost:3000/api/auth/googleCallback`,
      passReqToCallback   : true
  },
  //this function is called when the user is successfully authenticated
  (request, accessToken, refreshToken, profile, done) => {
    Users.findOne(
      { where: { email: profile.email } }
    ).then(user => {
        if (user) {
            return user.update({
                google_id: profile.id,
                is_verified: true
            });
        } else {
            return Users.create({
                email: profile.email,
                name: profile.name.givenName,
                surname: profile.name.familyName,
                google_id: profile.id,
                is_verified: true
            });
        }
    }).then(user => {
        return done(null, user);
    }).catch(err => {
        return done(err, null);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = { authenticateToken, authenticateTokenRedirect};
