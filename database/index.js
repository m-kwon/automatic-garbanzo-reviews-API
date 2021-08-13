const pg = require('pg');
const fs = require('fs');
const copyFrom = require('pg-copy-streams').from;
const { username, password, database } = require('../config');

const host = 'localhost';
const connectionString = `postgres://${username}:${password}@${host}/${database}`;
const client = new pg.Client(connectionString);
client.connect()
  .then(() => console.log('Connected to database...'))
  .catch(err => console.log('Failed connecting to database: ', err));

let tables = [];
tables.push(client.query('DROP TABLE IF EXISTS reviews CASCADE'));
tables.push(client.query('DROP TABLE IF EXISTS characteristics CASCADE'));
tables.push(client.query('DROP TABLE IF EXISTS photos CASCADE'));
tables.push(client.query('DROP TABLE IF EXISTS characteristics_reviews CASCADE'));

tables.push(client.query(`
CREATE TABLE reviews(
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  rating SMALLINT NOT NULL,
  date BIGINT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR(100) NOT NULL,
  reviewer_email VARCHAR(100) NOT NULL,
  response TEXT,
  helpfulness INTEGER NOT NULL
)
`));
tables.push(client.query(`
CREATE TABLE characteristics(
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR(20) NOT NULL
);
`));
tables.push(client.query(`
CREATE TABLE photos(
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL,
  url VARCHAR(1000)
);
`));
tables.push(client.query(`
CREATE TABLE characteristics_reviews(
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value SMALLINT NOT NULL
);
`));

Promise.all(tables);