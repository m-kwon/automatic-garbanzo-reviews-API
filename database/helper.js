const pg = require('pg');
const fs = require('fs');
const copyFrom = require('pg-copy-streams').from;
const { host, username, password, database } = require('../config');

const connectionString = `postgres://${username}:${password}@${host}/${database}`;

module.exports = (targetTable, inputFile) => {
  return new Promise((resolve, reject) => {
    const client = new pg.Client(connectionString);
    client.connect();

    let stream = client.query(copyFrom(`COPY ${targetTable} FROM STDIN CSV HEADER DELIMITER ','`));
    let fileStream = fs.createReadStream(inputFile);

    fileStream.on('error', (error) => {
      console.log(`Error reading ${inputFile}: ${error}`)
      reject(error);
    })
    stream.on('error', (error) => {
      console.log(`Error copying ${inputFile}: ${error}`)
    })
    stream.on('finish', () => {
      console.log(`Completed loading data into ${targetTable}`)
      client.end();
      resolve();
    });
    fileStream.pipe(stream);
  });
};