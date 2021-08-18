/*
- Determine how the system will perform under a sudden surge of traffic
- Determine if the system will recover once the traffic has subsided
*/

import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 100 }, // below normal load
    { duration: '1m', target: 100 },
    { duration: '10s', target: 2000 }, // spike to 2000 users
    { duration: '3m', target: 2000 }, // stay at 2000 users for 3 minutes
    { duration: '10s', target: 100 }, // scale down; recovery stage
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 }
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