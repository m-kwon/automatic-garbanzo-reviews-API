const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ROUTES
// index
app.get('/', (req, res) => res.status(200).send('INDEX'));

// reviews
app.use('/reviews', require('./routes'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server has started on port ${port}`));