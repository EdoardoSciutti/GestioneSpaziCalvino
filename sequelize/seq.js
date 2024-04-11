const Sequelize = require('sequelize');

const sequelize = new Sequelize('calvino_booking', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', 
  port: 3306, // Porta predefinita di MySQL
  define: {
    timestamps: false, // Opzionale: disabilita la generazione automatica dei timestamp
    freezeTableName: true,
  },
});

module.exports = sequelize;