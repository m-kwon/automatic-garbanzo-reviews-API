const Sequelize = require('sequelize');
const db = require('../index.js');

const Reviews = db.define('reviews', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  product_id: {
    type: Sequelize.INTEGER
  },
  rating: {
    type: Sequelize.INTEGER
  },
  date: {
    type: Sequelize.BIGINT
  },
  summary: {
    type: Sequelize.TEXT
  },
  body: {
    type: Sequelize.TEXT
  },
  recommend: {
    type: Sequelize.BOOLEAN
  },
  reported: {
    type: Sequelize.BOOLEAN
  },
  reviewer_name: {
    type: Sequelize.STRING
  },
  reviewer_email: {
    type: Sequelize.STRING
  },
  response: {
    type: Sequelize.STRING
  },
  helpfulness: {
    type: Sequelize.STRING
  }
},
{
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

Reviews.sync().then(() => console.log('reviews table created'));

module.exports = Reviews;