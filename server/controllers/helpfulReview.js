const pool = require('../../database');

module.exports = async (req, res) => {
  let text = `
    UPDATE reviews
    SET helpfulness = helpfulness + 1
    WHERE id = $1;
  `;
  let values = [req.params.review_id];

  pool.query(text, values)
    .then(() => res.status(200).send('Review marked helpful'))
    .catch((err) => res.status(500).send('Failed to mark review as helpful'))
};