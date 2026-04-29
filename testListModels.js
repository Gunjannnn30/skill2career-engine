const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

const options = {
  hostname: 'generativelanguage.googleapis.com',
  port: 443,
  path: `/v1beta/models?key=${apiKey}`,
  method: 'GET'
};

const req = https.request(options, (res) => {
  let chunks = '';
  res.on('data', (d) => chunks += d);
  res.on('end', () => console.log('Models response:', chunks));
});

req.on('error', (error) => console.error(error));
req.end();
