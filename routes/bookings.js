//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const express = require('express')
const router = express.Router()
require('dotenv').config();
const {authenticateToken} = require('../auth.js')
//modelli sql
const { Users, Rooms, Roles, Bookings, UserRoles } = require('../sequelize/model.js')
const { Op } = require('sequelize');
const { includes } = require('../database.js');

//   +--------------------------------------------------+
//   |   I start to write the code for the web server   |
//   +--------------------------------------------------+

router.post('/booksRoom', authenticateToken, async (req, res) => {
    const { room, date, start_time, end_time } = req.body
    const user_id = req.user.id
    if (!room || !date || !start_time || !end_time) 
        return res.status(400).json({ error: 'Missing room or date' });

    if (end_time <= start_time) {
        return res.status(400).json({ error: 'End time must be greater than start time' });
    }
    try{
        // it searches for a booking that has the same room, date and conflicting time
        const conflictingBooking = await Bookings.findOne({
            where: {
                room_id: room,
                date_day: date,
                start_time: {
                    [Op.lt]: end_time
                },
                end_time: {
                    [Op.gt]: start_time
                }
            }
        });

        if (conflictingBooking) {
            return res.status(400).json({ success: false, message: 'Room already booked' });
        }

        const [booking, created] = await Bookings.findOrCreate({
            where: {
                room_id: room,
                date_day: date,
                start_time: start_time,
                end_time: end_time
            },
            defaults: {
                user_id: user_id
            }
        });

        if (created) {
            booking.save();
            res.status(201).json({ success: true, message: 'Room booked' });
        } else {
            res.status(400).json({ success: false, message: 'Room already booked' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/getBookingsOfRoom/:roomId', authenticateToken, async (req, res) => {
    const {roomId} = req.params;
    
    Rooms.findAll({
        where: {
            id: roomId
        },
        include: {
            model: Bookings
        }
    }).then(rooms => {
        res.status(200).json(rooms);
    }).catch(error => {
        res.status(500).json({ error: error.message });
    });

});

// the format of the date must be YYYY-MM-DD
router.get('/getBookingsOfDay/:day', authenticateToken, async (req, res) => {
    const {day} = req.params;
    
    Bookings.findAll({
        where: {
            date_day: day
        }, include: {
            model: Rooms
        }
    }).then(bookings => {
        res.status(200).json(bookings);
    }).catch(error => {
        res.status(500).json({ error: error.message });
    });
})



module.exports = router