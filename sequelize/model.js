const Sequelize = require('sequelize');
const sequelize = require('./seq.js');

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

Email_verifications.belongsTo(Users, { foreignKey: 'user_id' });
Users.hasOne(Email_verifications, { foreignKey: 'user_id' });

Users.belongsToMany(Roles, { through: UsersRoles, foreignKey: 'user_id' });
Roles.belongsToMany(Users, { through: UsersRoles, foreignKey: 'role_id' });

Bookings.belongsTo(Users, { foreignKey: 'user_id' });
Users.hasMany(Bookings, { foreignKey: 'user_id' });

Bookings.belongsTo(Rooms, { foreignKey: 'room_id' });
Rooms.hasMany(Bookings, { foreignKey: 'room_id' });

module.exports = {Users, Rooms, Roles, Bookings, UsersRoles, Email_verifications} 