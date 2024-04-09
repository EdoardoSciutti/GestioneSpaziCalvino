//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const express = require('express')
const router = express.Router()
require('dotenv').config();

//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

//   +--------------------------------------------------+
//   |   I start to write the code for the web server   |
//   +--------------------------------------------------+

router.post('/bookRoom', (req, res) => {
    const { room, date } = req.body
    
})

module.exports = router