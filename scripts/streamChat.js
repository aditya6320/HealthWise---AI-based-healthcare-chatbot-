const http = require('http');

const postData = JSON.stringify({ message: 'Tell me about headaches' });

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/chat/stream',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    process.stdout.write('CHUNK: ' + chunk);
  });
  res.on('end', () => {
    console.log('\n-- stream ended --');
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

req.write(postData);
req.end();
