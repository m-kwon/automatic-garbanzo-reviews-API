const express = require('express');
const pg = require('pg');
const { username, password, database } = require('../config')
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ROUTES
app.get('/', (req, res) => res.status(200).send('INDEX'));
app.use('/reviews', require('./routes'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server has started on port ${port}`));