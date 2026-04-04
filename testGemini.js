const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

const data = JSON.stringify({
  contents: [{ parts: [{ text: "Hi" }] }]
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  port: 443,
  path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log("Sending request to Google Gemini...");
const req = https.request(options, (res) => {
  let chunks = '';
  res.on('data', (d) => chunks += d);
  res.on('end', () => console.log('Response:', chunks));
});

req.on('error', (error) => console.error(error));
req.write(data);
req.end();
