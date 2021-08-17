const supertest = require('supertest');
const request = supertest('http://localhost:5000');

const product_id = 1 + Math.floor(Math.random() * (1000011 - 1 + 1));

test('GET /reviews', async () => {
  jest.setTimeout(60000);
  let times = [];

  for (let i = 0; i < 30; i++) {
    let testId = 1 + Math.floor(Math.random() * (1000011 - 1 + 1));
    let timeBeforeReq = Date.now();

    await request.get(`/reviews/?product_id=${testId}`);
    times.push(Date.now() - timeBeforeReq);
  }

  let avgTime = times.reduce((sum, time) => sum + time) / times.length;
  console.log(`GET /reviews completed in: ${avgTime} ms`);

  let response = await request.get(`/reviews/?product_id=${product_id}`);

  let body = response.body;
  expect(Number(body.product_id)).toBe(product_id);

  let results = body.results;
  if (results.length > 0) {
    let testResult = results[0];

    // test that properties exist
    expect(testResult).toHaveProperty('review_id');
    expect(testResult).toHaveProperty('rating');
    expect(testResult).toHaveProperty('summary');
    expect(testResult).toHaveProperty('recommend');
    expect(testResult).toHaveProperty('response');
    expect(testResult).toHaveProperty('body');
    expect(testResult).toHaveProperty('date');
    expect(testResult).toHaveProperty('reviewer_name');
    expect(testResult).toHaveProperty('helpfulness');
    expect(testResult).toHaveProperty('photos');

    // test that properties have the correct type
    expect(typeof testResult.review_id).toBe('number');
    expect(typeof testResult.rating).toBe('number');
    expect(typeof testResult.summary).toBe('string');
    expect(typeof testResult.recommend).toBe('boolean');
    if (testResult.response !== null) { expect(typeof testResult.response).toBe('string') };
    expect(typeof testResult.body).toBe('string');
    expect(typeof testResult.date).toBe('string');
    expect(typeof testResult.reviewer_name).toBe('string');
    expect(typeof testResult.helpfulness).toBe('number');
    expect(Array.isArray(testResult.photos)).toBe(true);

    if (testResult.photos.length > 0) {
      let testPhoto = testResult.photos[0];
      expect(testPhoto).toHaveProperty('id');
      expect(testPhoto).toHaveProperty('url');
      expect(typeof testPhoto.id).toBe('number');
      expect(typeof testPhoto.url).toBe('string');
    }
  }
});

test('GET /reviews/meta', async () => {
  let timeBeforeReq = Date.now();

  let response = await request.get(`/reviews/meta/?product_id=${product_id}`);
  console.log(`GET /reviews/meta completed in: ${Date.now() - timeBeforeReq} ms`);

  let body = response.body;
  expect(Number(body.product_id)).toBe(product_id);

  // test if recommended rating is valid
  expect(body.recommended).toHaveProperty('0');
  expect(body.recommended).toHaveProperty('1');

  // test if ratings are valid
  expect(body.ratings).toHaveProperty('1');
  expect(body.ratings).toHaveProperty('2');
  expect(body.ratings).toHaveProperty('3');
  expect(body.ratings).toHaveProperty('4');
  expect(body.ratings).toHaveProperty('5');
  expect(body.ratings['1']).toBeGreaterThanOrEqual(0);
  expect(body.ratings['2']).toBeGreaterThanOrEqual(0);
  expect(body.ratings['3']).toBeGreaterThanOrEqual(0);
  expect(body.ratings['4']).toBeGreaterThanOrEqual(0);
  expect(body.ratings['5']).toBeGreaterThanOrEqual(0);

  // test if characteristic ratings are valid
  let chars = body.characteristics;
  expect(Object.keys(chars).length).toBeGreaterThanOrEqual(1);
  expect(Object.keys(chars).length).toBeLessThanOrEqual(6);
  for (let key in chars) {
    expect(chars[key]).toHaveProperty('id');
    expect(chars[key]).toHaveProperty('value');

    expect(typeof chars[key]['id']).toBe('number');
    expect(typeof chars[key]['value']).toBe('string');

    expect(Number(chars[key]['value'])).toBeGreaterThanOrEqual(0);
    expect(Number(chars[key]['value'])).toBeLessThanOrEqual(5);
  }
});