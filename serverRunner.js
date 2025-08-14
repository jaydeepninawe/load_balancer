// serverRunner.js
const express = require('express');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3001;
const name = process.env.SERVER_NAME || `Server-${port}`;
const region = process.env.REGION || 'DEFAULT';

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'badiya',
    name,
    port,
    region,
    time: new Date().toISOString()
  });
});

// Main route
app.get('/', (req, res) => {
  res.send(`<h2>👋 Hello from ${name} [${region}] on port ${port}</h2>`);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 ${name} running on http://localhost:${port} [${region}]`);
});
