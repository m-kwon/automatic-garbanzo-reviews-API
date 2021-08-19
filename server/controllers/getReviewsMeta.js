const pool = require('../../database');

module.exports = async (req, res) => {
  let text = `
    SELECT
      reviews.rating,
      reviews.recommend,
      characteristics.name,
      characteristics_reviews.review_id,
      characteristics_reviews.characteristic_id,
      characteristics_reviews.value
    FROM
      reviews
      INNER JOIN characteristics_reviews ON reviews.id = characteristics_reviews.review_id
      INNER JOIN characteristics ON characteristics.id = characteristics_reviews.characteristic_id
      WHERE reviews.product_id = $1
  `;
  let values = [req.query.product_id];

  let query = await pool.query(text, values);
  let reviewMetaData = { product_id: req.query.product_id };

  // AGGREGATE RATINGS AND RECOMMENDED
  reviewMetaData.ratings = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  reviewMetaData.recommended = { '0': 0, '1': 0 };
  let aggReviews = {};
  for (let i = 0; i < query.rows.length; i++) {
    if (!aggReviews[query.rows[i].review_id]) {
      let rowRating = query.rows[i].rating.toString();
      reviewMetaData.ratings[rowRating]++;

      if (query.rows[i].recommend) {
        reviewMetaData.recommended['1']++;
      } else {
        reviewMetaData.recommended['0']++;
      }
      aggReviews[query.rows[i].review_id] = true;
    }
  }

  // AGGREGATE CHARACTERISTIC RATINGS
  let characteristics = {};
  for (let j = 0; j < query.rows.length; j++) {
    let row = query.rows[j];
    if (!characteristics[row.name]) {
      characteristics[row.name] = { 'id': row.characteristic_id, 'value': row.value, 'count': 1 };
    } else {
      characteristics[row.name].value += row.value;
      characteristics[row.name].count++;
    }
  }
  for (let char in characteristics) {
    characteristics[char].value = (characteristics[char].value / characteristics[char].count).toFixed(4);
    delete characteristics[char].count;
  }
  reviewMetaData.characteristics = characteristics;

  res.status(200).send(reviewMetaData);
};