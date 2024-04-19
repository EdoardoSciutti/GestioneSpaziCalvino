const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// verify the token and redirect to login if it is not valid
function authenticateToken(req, res, next) {
    const {access_token} = req.cookies; // Leggi il token dal cookie
    const { refresh_token } = req.cookies; // Leggi il refresh token dal cookie
    console.log('token: ', access_token);
    if (access_token == null){
      // Invia solo una risposta
      return res.status(401).json({ success: false, message: 'Token not found' });
    } 
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

module.exports = { authenticateToken};
