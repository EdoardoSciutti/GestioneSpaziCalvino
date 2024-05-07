const Sequelize = require('sequelize');
const sequelize = require('./seq.js');
let cryptoRandomString;
import('crypto-random-string').then((module) => {
  cryptoRandomString = module.default;
});
const nodemailer = require('nodemailer');

const Rooms = sequelize.define('rooms', {
    room_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    description: Sequelize.STRING
},
{
    tableName: 'rooms',
    freezeTableName: true
});

const Roles = sequelize.define('roles', {
  role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
  },
  role_name: {
      type: Sequelize.STRING,
      allowNull: false,
  }
}, {
  tableName: 'roles',
  freezeTableName: true
});

const Users = sequelize.define('users', {
  user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  name: Sequelize.STRING,
  surname: Sequelize.STRING,
  email: Sequelize.STRING,
  google_id: Sequelize.STRING,
  password: Sequelize.STRING,
  is_verified: Sequelize.BOOLEAN
}, {
  tableName: 'users',
  freezeTableName: true
});

Users.afterCreate(async (user, options) => {
  Email_verifications.findOne({ where: { user_id: user.user_id } }).then(async email_verification => {
    if (email_verification) {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    
      // Invia l'email
      let info = await transporter.sendMail({
        from: '"No Reply" <no-reply@example.com>',
        to: user.email,
        subject: 'Conferma il tuo account',
        html: `
          <h1>Clicca sul bottone qui sotto per confermare il tuo account:</h1>
          <a href="http://localhost:3000/api/auth/verifyEmail/${email_verification.token}" style="background-color: #4CAF50; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 12px;">Conferma il tuo account</a>
        `
      });
    };
  });
 
});

const Bookings = sequelize.define('bookings', {
  booking_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
  },
  room_id: Sequelize.INTEGER,
  date_day: Sequelize.DATE,
  start_time: Sequelize.TIME,
  end_time: Sequelize.TIME,
  user_id: Sequelize.INTEGER,
  description: Sequelize.STRING
}, {
  tableName: 'bookings',
  freezeTableName: true
});

const UsersRoles = sequelize.define('users_roles', {
  user_role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
  },
  user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
  },
  role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
  }
}, {
  tableName: 'users_roles',
  freezeTableName: true,
  indexes: [
    {
        unique: true,
        fields: ['user_id', 'role_id']
    }
  ]
});

const Email_verifications = sequelize.define('email_verifications', {
  email_verification_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
  },
  user_id: Sequelize.INTEGER,
  token: Sequelize.STRING
}, {
  tableName: 'email_verifications',
  freezeTableName: true
});

Users.hasOne(Email_verifications, { foreignKey: 'user_id' });
Email_verifications.belongsTo(Users, { foreignKey: 'user_id' });

Users.belongsToMany(Roles, { through: UsersRoles, foreignKey: 'user_id' });
Roles.belongsToMany(Users, { through: UsersRoles, foreignKey: 'role_id' });

Bookings.belongsTo(Users, { foreignKey: 'user_id' });
Users.hasMany(Bookings, { foreignKey: 'user_id' });

Bookings.belongsTo(Rooms, { foreignKey: 'room_id' });
Rooms.hasMany(Bookings, { foreignKey: 'room_id' });

module.exports = {Users, Rooms, Roles, Bookings, UsersRoles, Email_verifications} 