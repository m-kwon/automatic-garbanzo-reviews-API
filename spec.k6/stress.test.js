/*
- Determine how the system will behave under extreme conditions
- Determine the maximum capacity of the system in terms of users or throughput
- Determine the breaking point of the system
- Determine if the system will recover without manual intervention
*/

import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // below normal load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 }, // normal load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 }, // around the breaking point
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 }, // beyond the breaking point
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 }, // scale down; recovery stage
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