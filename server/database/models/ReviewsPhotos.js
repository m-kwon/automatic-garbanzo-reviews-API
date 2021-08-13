const Sequelize = require('sequelize');
const db = require('../index.js');

const ReviewsPhotos = db.define('reviews_photos', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  url: {
    type: Sequelize.STRING
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

ReviewsPhotos.sync().then(() => console.log('reviews_photos table created'));

module.exports = ReviewsPhotos;