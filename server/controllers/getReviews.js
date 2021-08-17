const pool = require('../../database');

module.exports = async (req, res) => {
  let count = req.query.count || 5;

  let sortBy = 'date';
  if (req.query.sort !== 'newest') { sortBy = 'helpfulness'; }

  let col = `
    r.id AS review_id,
    r.rating,
    r.summary,
    r.recommend,
    r.response,
    r.body,
    TO_CHAR(TO_TIMESTAMP(r.date / 1000), 'YYYY-MM-DDThh:mm:ss.SSSZ') AS date,
    r.reviewer_name,
    r.helpfulness
  `;
  let text = `
    SELECT ${col}, (
      SELECT json_agg(photo) FROM (
        SELECT id, url FROM photos WHERE review_id = r.id
      ) photo
    ) AS photos
    FROM reviews as r
    WHERE r.product_id = $1
    AND r.reported = false
    ORDER BY ${sortBy} DESC
    LIMIT $2`;
  let values = [req.query.product_id, count];

  let query = await pool.query(text, values);
  let reviewData = { product_id: req.query.product_id, page: 0, count: count };
  reviewData.results = query.rows;

  for (let i = 0; i < reviewData.results.length; i++) {
    if (!reviewData.results[i].photos) {
      reviewData.results[i].photos = [];
    }
  }

  res.status(200).send(reviewData);
};