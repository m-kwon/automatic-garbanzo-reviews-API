const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// ROUTES
// example
app.use('/', (req, res) => res.status(200).send('Welcome'));

// GET review data

// GET review metaData

// POST review

// PUT helpful review

// PUT report review

const port = 3001;
const host = '0.0.0.0';
app.listen(port, host, () => console.log(`Server has started on **http://${host}:${port}`));

