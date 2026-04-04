const https = require('https');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;

const data = JSON.stringify({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Hi" }]
});

const options = {
  hostname: 'api.openai.com',
  port: 443,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log("Sending request to OpenAI...");
const req = https.request(options, (res) => {
  let chunks = '';
  res.on('data', (d) => chunks += d);
  res.on('end', () => console.log('Response:', chunks));
});

req.on('error', (error) => console.error(error));
req.write(data);
req.end();
