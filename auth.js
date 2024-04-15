const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


function authenticateToken(req, res, next) {
    const {access_token} = req.cookies; // Leggi il token dal cookie
    console.log('token: ', access_token);
    if (access_token == null){
      console.log('token non trovato');
      return res.sendStatus(401); // se non c'è un token, restituisci un errore 401
    } 
  
    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      } // se c'è un errore durante la verifica, restituisci un errore 403
      req.user = user;
      console.log('user: ', user);
      next(); // passa al prossimo middleware
    });
}

module.exports = {authenticateToken};