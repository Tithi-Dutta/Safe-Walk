const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const accessServ = require('./accessServ');
const bodyParser = require('body-parser');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.static(path.join(__dirname, '../frontEnd')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/location', accessServ);

/*const PORT = 5000;
const HOST = 'localhost'; 
app.listen(PORT, HOST, () => {
  console.log(`Server started at http://${HOST}:${PORT}`);
});*/
const fs = require('fs');
const https = require('https');
const PORT = 5000;
const HOST = '0.0.0.0';

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(PORT, HOST, () => {
  console.log(`Secure server started at https://${HOST}:${PORT}`);
});