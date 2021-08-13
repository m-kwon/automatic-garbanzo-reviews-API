const Sequelize = require('sequelize');
const db = require('../index.js');

const Characteristics = db.define('characteristics', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  product_id: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  }
},
{
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

Characteristics.sync().then(() => console.log('characteristics table created'));

module.exports = Characteristics;