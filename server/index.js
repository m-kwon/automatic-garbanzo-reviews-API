const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// ROUTES
// GET index
app.use('/', (req, res) => res.status(200).send('INDEX'));

const port = process.env.PORT || 5000;
const host = '0.0.0.0';
app.listen(port, host, () => console.log(`Server has started on **http://${host}:${port}`));

