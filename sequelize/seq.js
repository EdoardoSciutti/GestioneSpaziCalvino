const Sequelize = require('sequelize'); 
const dotenv = require('dotenv');
const fs = require("fs")
const path = require("path")
//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const database_user = process.env.DATABASE_USER;
const database_password = process.env.DATABASE_PASSWORD;
const database_name = process.env.DATABASE_NAME;
const database_host = process.env.DATABASE_HOST;

const sequelize = new Sequelize(database_name, database_user, database_password, {
  host: database_host,
  dialect: 'mysql',
  port: 3306,
  define: {
    timestamps: false,
    freezeTableName: true,
  },
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, "../certificate/Microsoft RSA Root Certificate Authority 2017.crt")),
      rejectUnauthorized: false // Add this line
    }
  }
});

module.exports = sequelize;