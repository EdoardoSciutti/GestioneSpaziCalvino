const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// verify the token and redirect to login if it is not valid
function authenticateToken(req, res, next) {
    const {access_token} = req.cookies; // Leggi il token dal cookie
    console.log('token: ', access_token);
    if (access_token == null){
      console.log('token not found');
      res.redirect('/login')
    } 
  
    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect('/login')
      } // se c'è un errore durante la verifica, restituisci un errore 403
      req.user = user;
      console.log('user: ', user);
      next(); // passa al prossimo middleware
    });
}

module.exports = {authenticateToken};