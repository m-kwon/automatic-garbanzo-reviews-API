const Sequelize = require('sequelize');
const db = require('../index.js');

const CharacteristicReviews = db.define('characteristic_reviews', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  value: {
    type: Sequelize.INTEGER
  },
  characteristic_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'characteristics',
      key: 'id'
    }
  },
  review_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'reviews',
      key: 'id'
    }
  }
},
{
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

CharacteristicReviews.sync().then(() => console.log('characteristic_reviews table created'));

module.exports = CharacteristicReviews;