//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+
const Sequelize = require('sequelize');
const express = require('express')
const router = express.Router()
require('dotenv').config();
const {authenticateToken} = require('../auth.js')
//modelli sql
const { Users, Rooms, Roles, Bookings, UserRoles } = require('../sequelize/model.js')
const { Op, where } = require('sequelize');

//   +--------------------------------------------------+
//   |   I start to write the code for the web server   |
//   +--------------------------------------------------+

/*
    Description: allow the user to book a room
    Path: http://localhost:3000/api/bookings/booksRoom
    Method: POST
    Response: a message that confirms the booking 
    Requirement: authentication token
 */
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

router.post('/deleteBooking', authenticateToken, async (req, res) => {
    const {date_day, start_time, end_time, room_id} = req.body;
    const user_id = req.user.id;
    Bookings.findOne({
        where: {
            date_day: date_day,
            start_time: start_time,
            end_time: end_time,
            room_id: room_id,
        }
    }).then(booking => {
        if (booking && booking.user_id == user_id) {
            booking.destroy();
            res.status(200).json({ success: true, message: 'Booking deleted' });
        } else if(booking && booking.user_id != user_id){
            UserRoles.findOne({
                where: {
                    user_id: user_id
                }
            }).then(userRole => {
                if (userRole.role_id == 1) {
                    booking.destroy();
                    res.status(200).json({ success: true, message: 'Booking deleted' });
                } else {
                    res.status(400).json({ success: false, message: 'You are not authorized to delete this booking' });
                }
            });
        } 
        else {
            res.status(400).json({ success: false, message: 'Booking not found' });
        }
    }).catch(error => {
        res.status(500).json({ error: error.message });
    });
});
/*
    Description: get all the bookings of a specific room
    Path: http://localhost:3000/api/bookings/getBookingsOfRoom/:roomId
    Method: GET
    Request parameters: the id of the room
    Response: the list of bookings of the room
    Requirement: authentication token
 */
router.get('/getBookingsOfRoom/:roomId', authenticateToken, async (req, res) => {
    const {roomId} = req.params;
    
    Rooms.findAll({
        where: {
            room_id: roomId
        },
        attributes: ['description'],
        include: {
            model: Bookings,
            attributes: ['start_time', 'end_time', 'description', 'date_day'],
        }
    }).then(rooms => {
        res.status(200).json(rooms);
    }).catch(error => {
        res.status(500).json({ error: error.message });
        console.log(error);
    });

});

router.get('/getBookingsOfRoom/:roomId/:day', authenticateToken, async (req, res) => {
    const {roomId, day} = req.params;
    console.log(day);
    Rooms.findAll({
        where: {
            room_id: roomId
        },
        attributes: ['description'],
        include: {
            model: Bookings,
            where: {
                date_day: Sequelize.where(Sequelize.fn('date', Sequelize.col('date_day')), '=', day)
            },
            attributes: ['start_time', 'end_time', 'description', 'date_day'],
            include: {
                model: Users,
                attributes: ['name', 'surname']
            }
        }
    }).then(rooms => {
        res.status(200).json(rooms);
    }).catch(error => {
        res.status(500).json({ error: error.message });
        console.log(error);
    });

});

/*
    Description: get all the bookings of a specific day
    Path: http://localhost:3000/api/bookings/getBookingsOfDay/:day
    Method: GET
    Request parameters: day (the format of the date must be YYYY-MM-DD)
    Response: the list of bookings of the day
    Requirement: authentication token
 */
router.get('/getBookingsOfDay/:day', authenticateToken, async (req, res) => {
    const {day} = req.params;
    
    Bookings.findAll({
        where: {
            date_day: day
        },
        attributes: ['start_time', 'end_time', 'description'],
        include: {
            model: Rooms,
            attributes: ['description']
        }
    }).then(bookings => {
        res.status(200).json(bookings);
    }).catch(error => {
        res.status(500).json({ error: error.message });
    });
})

/*
    Description: get all the bookings of the current day
    Path: http://localhost:3000/api/bookings/getBookingsOfDay
    Method: GET
    Request parameters: nothing
    Response: the list of bookings of the current day
    Requirement: authentication token
 */
router.get('/getBookingsOfDay', authenticateToken, async (req, res) => {
    const day = new Date().toISOString().slice(0, 10);
        
    Bookings.findAll({
        where: {
            date_day: day
        }, 
        attributes: ['start_time', 'end_time', 'description'],
        include: {
            model: Rooms
        }
    }).then(bookings => {
        res.status(200).json(bookings);
    }).catch(error => {
        res.status(500).json({ error: error.message });
    });
})
    

module.exports = router