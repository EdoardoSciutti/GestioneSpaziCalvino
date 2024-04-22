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
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
  },
  name: Sequelize.STRING,
  surname: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  is_verified: Sequelize.BOOLEAN
}, {
  tableName: 'users',
  freezeTableName: true
});

Users.afterCreate(async (user, options) => {
  const emailToken = cryptoRandomString({length: 10});
  Email_verifications.create({
    token: emailToken,
    user_Id: user.user_id,
  });

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
    text: `Per favore conferma il tuo account cliccando sul seguente link: http://localhost:3000/api/auth/verifyEmail/${emailToken}`
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

Users.hasOne(Email_verifications, { foreignKey: 'userId' });
Email_verifications.belongsTo(Users, { foreignKey: 'userId' });

Users.belongsToMany(Roles, { through: UsersRoles, foreignKey: 'user_id' });
Roles.belongsToMany(Users, { through: UsersRoles, foreignKey: 'role_id' });

Bookings.belongsTo(Users, { foreignKey: 'user_id' });
Users.hasMany(Bookings, { foreignKey: 'user_id' });

Bookings.belongsTo(Rooms, { foreignKey: 'room_id' });
Rooms.hasMany(Bookings, { foreignKey: 'room_id' });

module.exports = {Users, Rooms, Roles, Bookings, UsersRoles, Email_verifications} 