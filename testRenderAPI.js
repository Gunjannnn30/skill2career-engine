const https = require('https');

const data = JSON.stringify({
  role: 'Software Engineer'
});

const options = {
  hostname: 'skill2career-engine.onrender.com',
  path: '/api/ai/career-details',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  console.log('Status:', res.statusCode);
  res.on('data', chunk => body += chunk.toString());
  res.on('end', () => {
    console.log('Response:', body.substring(0, 1000));
    try {
      const j = JSON.parse(body);
      console.log('aiEnhanced?', j.aiEnhanced);
    } catch (e) { }
  });
});

req.on('error', error => console.error('Error:', error));
req.write(data);
req.end();
