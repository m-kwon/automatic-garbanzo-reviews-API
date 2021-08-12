const Sequelize = require('sequelize');
const { username, password, database } = require('./config');

const db = new Sequelize(database, username, password, {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Database failed to connect: ', err));

  module.exports = db;