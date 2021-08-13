const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

router
  .get('/', controllers.getReviews)
  .get('/meta', controllers.getReviewsMeta);

router
  .post('/', controllers.postReview);

router
  .put('/:review_id/helpful', controllers.helpfulReview)
  .put('/:review_id/report', controllers.reportReview)

module.exports = router;