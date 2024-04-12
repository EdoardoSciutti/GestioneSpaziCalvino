//di base
const express = require('express')
const router = express.Router()

//modelli sql
const { User, Rooms, Roles, Bookings, UserRoles } = require('../sequelize/model.js')

//.env
require('dotenv').config();

//bcript
const bcrypt = require('bcrypt');

//get delle pagine login e signup
router.get('/login', async(req, res) => {
    res.render('../public/views/login.ejs');
});

router.get('/signup', (req, res) => {
    res.render('../public/views/signup.ejs');
});

//registrazione
router.post('/register', (req, res) => {
    const { email, password } = req.body
    try {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                res.status(500).json({ error: err.message });
            return;
            }
            User.findOrCreate({
                where: {
                    email: email,
                    password: hash
                }
            }).then(([user, created]) => {
                if (created) {
                    const user_for_token = { email: user.email, id: user.id };
                    const access_token = jwt.sign(user_for_token, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
                    const refresh_token = jwt.sign(user_for_token, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
                    res.cookie('access_token', access_token, { httpOnly: true });
                    res.cookie('refresh_token', refresh_token, { httpOnly: true });
                    res.status(201).json({ message: 'User created'});
                } else {
                    res.status(400).json({ message: 'User already exists'});
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router