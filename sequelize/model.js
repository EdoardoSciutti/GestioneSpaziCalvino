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