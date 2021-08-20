/*
- Verify that the system doesn't suffer from bugs or memory leaks after a long period of time
- Verify that the database doesn't exhaust the allotted storage space and stops
- Determine the maximum amount of users the system can handle and then set VUs to 75% of that value
*/

import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 500 },
    { duration: '4h', target: 500 },
    { duration: '2m', target: 0 }
  ]
};

const API_BASE_URL = 'http://localhost:5000';
const productId = Math.floor(Math.random() * 1000011);

export default () => {
  http.batch([
    ['GET', `${API_BASE_URL}/reviews/?product_id=${productId}`],
    ['GET', `${API_BASE_URL}/reviews/meta/?product_id=${productId}`]
  ])
  sleep(1);
};