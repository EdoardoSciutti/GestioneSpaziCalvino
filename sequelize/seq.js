const Sequelize = require('sequelize'); 

const sequelize = new Sequelize('calvino_booking', 'root', '', { // Nome del database, username e password
  host: 'localhost', // Indirizzo del server MySQL
  dialect: 'mysql',  // Tipo di database
  port: 3306, // Porta predefinita di MySQL
  define: {
    timestamps: false, // Opzionale: disabilita la generazione automatica dei timestamp
    freezeTableName: true, // Opzionale: disabilita la pluralizzazione automatica dei nomi delle tabelle
  },
});

module.exports = sequelize;