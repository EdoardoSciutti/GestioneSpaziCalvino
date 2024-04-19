//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const db = require('./database.js')

//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const serverHost = process.env.SERVER_HOST;
const protocol = process.env.SERVER_PROTOCOL;

//   +-------------------------------------------------+
//   |   We create the functions we are gonna export   |
//   +-------------------------------------------------+


passport.use(new GoogleStrategy(
    {
        clientID:     googleClientId,
        clientSecret: googleClientSecret,
        //change this path to newest
        callbackURL: `${protocol}://${serverHost}/api/auth/googleCallback`,
        passReqToCallback   : true
    },
    //this function is called when the user is successfully authenticated
    (request, accessToken, refreshToken, profile, done) => {
        // What to do when the user is authenticated
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});