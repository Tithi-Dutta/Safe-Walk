const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const bodyParser = require('body-parser');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.static(path.join(__dirname, '../frontEnd')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;
const HOST = 'localhost'; 
app.listen(PORT, HOST, () => {
  console.log(`Server started at http://${HOST}:${PORT}`);
});