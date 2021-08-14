const pool = require('../../database');

module.exports = async (req, res) => {
  let text = `
    UPDATE reviews
    SET reported = true
    WHERE id = $1;
  `;
  let values = [req.params.review_id];

  pool.query(text, values)
    .then(() => res.status(200).send('Reported review'))
    .catch((err) => res.status(500).send('Failed to report review'))
};