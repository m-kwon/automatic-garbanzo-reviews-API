const express = require('express');
const cors = require('cors');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

const port = 3001;
const host = '0.0.0.0';
app.listen(port, host, () => console.log(`Server has started on **http://${host}:${port}`));