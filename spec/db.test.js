const pg = require('pg');
const { host, username, password, database } = require('../config')
const connectionString = `postgres://${username}:${password}@${host}/${database}`;
const moment = require('moment');

describe('Verify that all read queries used by thhe API run in under 50ms', () => {
  test('GET /reviews query should take under 50ms (ordered by date)', async () => {
    let clientOne = new pg.Client(connectionString);
    clientOne.connect();

    let times = [];

    for (let i = 0; i < 100; i++) {
      let max = (await clientOne.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      let min = Math.floor(max * 0.9);
      let testProductId = min + Math.floor(Math.random() * (max - min + 1));

      const timeBeforeQuery = Date.now();
      let col = `
        r.id AS review_id,
        r.rating,
        r.summary,
        r.recommend,
        NULLIF(r.response, 'null') as response,
        r.body,
        TO_CHAR(TO_TIMESTAMP(r.date / 1000), 'YYYY-MM-DDThh:mm:ss.SSSZ') AS date,
        r.reviewer_name,
        r.helpfulness
      `;
      let query = await clientOne.query(`
        SELECT ${col}, (
          SELECT json_agg(photo) FROM (
            SELECT id, url FROM photos WHERE review_id = r.id
          ) photo
        ) AS photos
        FROM reviews as r
        WHERE r.product_id = ${testProductId}
        AND r.reported = false
        ORDER BY date DESC
        LIMIT 100;`
      );
      const timeAfterQuery = Date.now();
      times.push(timeAfterQuery - timeBeforeQuery);
    }
    let avgTime = times.reduce((a, b) => (a + b)) / 100;
    console.log(`Average GET /reviews query time (ordered by date): ${avgTime} ms`);
    clientOne.end();
  });

  test('GET /reviews query should take under 50ms (ordered by helpfulness)', async () => {
    let clientTwo = new pg.Client(connectionString);
    clientTwo.connect();

    let times = [];

    for (let i = 0; i < 100; i++) {
      let max = (await clientTwo.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      let min = Math.floor(max * 0.9);
      let testProductId = min + Math.floor(Math.random() * (max - min + 1));

      const timeBeforeQuery = Date.now();
      let col = `
        r.id AS review_id,
        r.rating,
        r.summary,
        r.recommend,
        NULLIF(r.response, 'null') as response,
        r.body,
        TO_CHAR(TO_TIMESTAMP(r.date / 1000), 'YYYY-MM-DDThh:mm:ss.SSSZ') AS date,
        r.reviewer_name,
        r.helpfulness
      `;
      let query = await clientTwo.query(`
        SELECT ${col}, (
          SELECT json_agg(photo) FROM (
            SELECT id, url FROM photos WHERE review_id = r.id
          ) photo
        ) AS photos
        FROM reviews as r
        WHERE r.product_id = ${testProductId}
        AND r.reported = false
        ORDER BY helpfulness DESC
        LIMIT 100;`
      );
      const timeAfterQuery = Date.now();
      times.push(timeAfterQuery - timeBeforeQuery);
    }
    let avgTime = times.reduce((a, b) => (a + b)) / 100;
    console.log(`Average GET /reviews query time (ordered by helpfulness): ${avgTime} ms`);
    clientTwo.end();
  });

  test('GET /reviews photos data query should take under 50ms', async () => {
    let clientThree = new pg.Client(connectionString);
    clientThree.connect();

    let times = [];

    for (let i = 0; i < 100; i++) {
      let max = (await clientThree.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      let min = Math.floor(max * 0.9);
      let testReviewId = min + Math.floor(Math.random() * (max - min + 1));

      const timeBeforeQuery = Date.now();
      let query = await clientThree.query(`SELECT id, url FROM photos WHERE review_id = ${testReviewId}`);
      const timeAfterQuery = Date.now();
      times.push(timeAfterQuery - timeBeforeQuery);
    }
    let avgTime = times.reduce((a, b) => (a + b)) / 100;
    console.log(`Average GET /reviews photos query time: ${avgTime} ms`);
    clientThree.end();
  });

  test('GET /reviews query should take under 50ms (ordered by date)', async () => {
    let clientFour = new pg.Client(connectionString);
    clientFour.connect();

    let times = [];

    for (let i = 0; i < 100; i++) {
      let max = (await clientFour.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      let min = Math.floor(max * 0.9);
      let testProductId = min + Math.floor(Math.random() * (max - min + 1));

      const timeBeforeQuery = Date.now();
      let query = await clientFour.query(`
        SELECT
          reviews.rating,
          reviews.recommend,
          characteristics.name,
          characteristics_reviews.review_id,
          characteristics_reviews.characteristic_id,
          characteristics_reviews.value
        FROM reviews
        INNER JOIN characteristics_reviews ON reviews.id = characteristics_reviews.review_id
        INNER JOIN characteristics ON characteristics.id = characteristics_reviews.characteristic_id
        WHERE reviews.product_id = ${testProductId}
      `);
      const timeAfterQuery = Date.now();
      times.push(timeAfterQuery - timeBeforeQuery);
    }
    let avgTime = times.reduce((a, b) => (a + b)) / 100;
    console.log(`Average GET /reviews/meta query time: ${avgTime} ms`);
    clientFour.end();
  });

  test('POST /reviews query should take under 50ms', async () => {
    let clientFive = new pg.Client(connectionString);
    clientFive.connect();

    let times = [];

    for (let i = 0; i < 100; i++) {
      let max = (await clientFive.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      let min = Math.floor(max * 0.9);
      let testProductId = min + Math.floor(Math.random() * (max - min + 1));

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
      let values = [
        testProductId,
        5,
        moment().valueOf(),
        'test summary',
        'test body test body test body test body test body test body',
        true,
        false,
        'test name',
        'test@email.com',
        'test response',
        0
      ];
      const timeBeforeQuery = Date.now();
      let testReviewId = (await clientFive.query(text, values)).rows[0].id;
      const timeAfterQuery = Date.now();
      times.push(timeAfterQuery - timeBeforeQuery);

      await clientFive.query(`DELETE FROM reviews WHERE id = ${testReviewId};`);
    }

    await clientFive.query(`SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews) + 1);`);

    let avgTime = times.reduce((a, b) => (a + b)) / 100;
    console.log(`Average POST /reviews query time: ${avgTime} ms`);
    clientFive.end();
  });

  test('POST /reviews photos query should take under 50ms', async () => {
    let clientSix = new pg.Client(connectionString);
    clientSix.connect();

    let times = [];

    for (let i = 0; i < 100; i++) {
      let max = (await clientSix.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      let min = Math.floor(max * 0.9);
      let testReviewId = min + Math.floor(Math.random() * (max - min + 1));

      let text = `
        INSERT INTO photos (review_id, url)
        VALUES (${testReviewId}, 'testURL')
        RETURNING id
      `;

      const timeBeforeQuery = Date.now();
      let testPhotoId = (await clientSix.query(text)).rows[0].id;
      const timeAfterQuery = Date.now();
      times.push(timeAfterQuery - timeBeforeQuery);

      await clientSix.query(`DELETE FROM photos WHERE id = ${testPhotoId};`);
    }

    await clientSix.query(`SELECT setval('photos_id_seq', (SELECT MAX(id) FROM photos) + 1);`);

    let avgTime = times.reduce((a, b) => (a + b)) / 100;
    console.log(`Average POST /reviews photos query time: ${avgTime} ms`);
    clientSix.end();
  });

  test('POST /reviews characteristics query should take under 50ms', async () => {
    let clientSeven = new pg.Client(connectionString);
    clientSeven.connect();

    let times = [];

    for (let i = 0; i < 100; i++) {
      let max = (await clientSeven.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      let min = Math.floor(max * 0.9);
      let testReviewId = min + Math.floor(Math.random() * (max - min + 1));

      let text = `
        INSERT INTO characteristics_reviews (review_id, characteristic_id, value)
        VALUES (${testReviewId}, 53703, 5)
        RETURNING id
      `;

      const timeBeforeQuery = Date.now();
      let testCharId = (await clientSeven.query(text)).rows[0].id;
      const timeAfterQuery = Date.now();
      times.push(timeAfterQuery - timeBeforeQuery);

      await clientSeven.query(`DELETE FROM characteristics_reviews WHERE id = ${testCharId};`);
    }

    await clientSeven.query(`SELECT setval('characteristics_reviews_id_seq', (SELECT MAX(id) FROM characteristics_reviews) + 1);`);

    let avgTime = times.reduce((a, b) => (a + b)) / 100;
    console.log(`Average POST /reviews characteristics query time: ${avgTime} ms`);
    clientSeven.end();
  });

  test('PUT /reviews/:review_id/helpful query should take under 50ms', async () => {
    let clientEight = new pg.Client(connectionString);
    clientEight.connect();

    let times = [];

    for (let i = 0; i < 100; i++) {
      let max = (await clientEight.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      let min = Math.floor(max * 0.9);
      let testReviewId = min + Math.floor(Math.random() * (max - min + 1));

      let text = `
        UPDATE reviews
        SET helpfulness = helpfulness + 1
        WHERE id = ${testReviewId};
      `;
      let counterText = `
        UPDATE reviews
        SET helpfulness = helpfulness - 1
        WHERE id = ${testReviewId};
      `;

      const timeBeforeQuery = Date.now();
      await clientEight.query(text);
      const timeAfterQuery = Date.now();
      times.push(timeAfterQuery - timeBeforeQuery);

      await clientEight.query(counterText);
    }

    let avgTime = times.reduce((a, b) => (a + b)) / 100;
    console.log(`Average PUT /reviews/:review_id/helpful query time: ${avgTime} ms`);
    clientEight.end();
  });

  test('PUT /reviews/:review_id/reported query should take under 50ms', async () => {
    let clientNine = new pg.Client(connectionString);
    clientNine.connect();

    let times = [];

    for (let i = 0; i < 100; i++) {
      let max = (await clientNine.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      let min = Math.floor(max * 0.9);
      let testReviewId = min + Math.floor(Math.random() * (max - min + 1));
      let testReportFlag = (await clientNine.query(`SELECT reported FROM reviews WHERE id = ${testReviewId};`)).rows[0].reported;

      let text = `
        UPDATE reviews
        SET reported = ${!testReportFlag}
        WHERE id = ${testReviewId};
      `;
      let counterText = `
        UPDATE reviews
        SET reported = ${testReportFlag}
        WHERE id = ${testReviewId};
      `;

      const timeBeforeQuery = Date.now();
      await clientNine.query(text);
      const timeAfterQuery = Date.now();
      times.push(timeAfterQuery - timeBeforeQuery);

      await clientNine.query(counterText);
    }

    let avgTime = times.reduce((a, b) => (a + b)) / 100;
    console.log(`Average PUT /reviews/:review_id/reported query time: ${avgTime} ms`);
    clientNine.end();
  });
});