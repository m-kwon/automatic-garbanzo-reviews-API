const pool = require('../../database');
const moment = require('moment');

module.exports = async (req, res) => {
  let date = moment().valueOf()
  let text = `
    INSERT INTO reviews (
      product_id,
      rating,
      date,
      summary,
      body,
      recommend,
      reported,
      reviewer_name,
      reviewer_email,
      response,
      helpfulness
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    ) RETURNING id
  `;

  let reviewFormInputs = [
    req.body.product_id,
    req.body.rating,
    date,
    req.body.summary,
    req.body.body,
    req.body.recommend,
    false,
    req.body.name,
    req.body.email,
    null,
    0
  ];

  let query = await pool.query(text, reviewFormInputs);
  let reviewId = query.rows[0].id;

  let promiseQueries = [];

  // INSERT CHARACTERISTIC RATINGS
  let chars = ['Size', 'Width', 'Comfort', 'Quality', 'Length', 'Fit'];
  let characteristics = req.body.characteristics;
  let textChar = `
    INSERT INTO characteristics_reviews (
      review_id,
      characteristic_id,
      value
    ) VALUES (
      $1, $2, $3
    )
  `;

  for (let key in characteristics) {
    let valuesChar = [reviewId, Number(key), characteristics[key]]
    promiseQueries.push(pool.query(textChar, valuesChar));
  }

  // INSERT PHOTOS
  let photos = req.body.photos;
  let textPhotos = `
    INSERT INTO photos (review_id, url)
    VALUES ($1, $2, $3)
  `;
  for (let j = 0; j < photos.length; j++) {
    let valuesPhotos = [reviewId, photos[j]];
    promiseQueries.push(pool.query(textPhotos, valuesPhotos));
  }

  Promise.all(promiseQueries)
    .then(() => res.status(200).send('Review successfully posted'))
    .catch((err) => res.status(500).send('Review failed to post'));
};