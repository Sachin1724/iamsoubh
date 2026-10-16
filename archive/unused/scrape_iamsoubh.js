const https = require('https');

https.get('https://iamsoubh.com/odia-calendar/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /https?:\/\/[^\s"'<>]+uploads\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi;
    const matches = data.match(regex);
    const unique = [...new Set(matches || [])];
    console.log('Found images:', unique);
  });
}).on('error', console.error);
