const http = require('http');

const data = JSON.stringify({ role: 'software engineer' });

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/ai/career-details',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk.toString());
  res.on('end', () => console.log('Response:', body));
});

req.on('error', error => console.error('Error:', error));
req.write(data);
req.end();
