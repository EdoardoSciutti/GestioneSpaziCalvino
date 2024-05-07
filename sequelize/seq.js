const Sequelize = require('sequelize'); 
const dotenv = require('dotenv');
const fs = require("fs")
const path = require("path")
//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+


const sequelize = new Sequelize("calvino_booking", "root", "", {
  host: "localhost",
  dialect: 'mysql',
  port: 3306,
  define: {
    timestamps: false,
    freezeTableName: true,
  },
});

module.exports = sequelize;