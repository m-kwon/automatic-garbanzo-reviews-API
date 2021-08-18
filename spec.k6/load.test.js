/*
- Assess the current performance of the system under typical and peak load
- Determine if performance standards are met while changes to the system are made
*/

import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '5m', target: 500 }, // simulate ramp-up of traffic from 1 to 500 users over 5 minutes
    { duration: '10m', target: 500 }, // stay at 100 users for 10 minutes
    { duration: '5m', target: 0 } // scale down; recovery stage
  ],
  thresholds: {
    http_req_duration: ['p(99)<50'] // 99% of requests must complete below 50ms
  }
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