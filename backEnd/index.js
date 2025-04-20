const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const accessServ = require('./accessServ');
const safetyRoutes = require('./safety');
const sosService = require('./sosService');
const authRoutes = require('./registrationAndLogin');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

// Enable CORS with specific settings for HTTPS
app.use(cors({
  origin: '*', // In production, replace with your specific domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.static(path.join(__dirname, '../frontEnd')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Routes
// app.use('/location', accessServ);
app.use('/location', safetyRoutes);
app.use('/sos', sosService); 
app.use('/auth', authRoutes);  // Add the authentication routes

// HTTPS server with more detailed error logging
const PORT = 5000;
const HOST = '0.0.0.0';


try {
  // Read certificate files
  const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    // Make self-signed certificate more accepting for development
    rejectUnauthorized: false
  };

  // Create HTTPS server
  const server = https.createServer(options, app);
  
  server.listen(PORT, HOST, () => {
    console.log(`Secure server started at https://${HOST}:${PORT}`);
    console.log(`NOTE: For local development, visit https://localhost:${PORT} in your browser first and accept the certificate warning.`);
  });
  
  // Add error handling for the server
  server.on('error', (error) => {
    console.error('Server error:', error);
  });
} catch (error) {
  console.error('Error starting HTTPS server:', error);
  console.log('Falling back to HTTP server');
  
  // Fallback to HTTP if HTTPS fails
  app.listen(PORT, HOST, () => {
    console.log(`Server started at http://${HOST}:${PORT}`);
  });
}