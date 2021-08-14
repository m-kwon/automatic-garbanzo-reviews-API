const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config);
pool.connect()
  .then(() => console.log('Connected to database...'))
  .catch(err => console.log('Failed connecting to database: ', err));

  module.exports = pool;