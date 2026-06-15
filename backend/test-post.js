const http = require('http');

const data = JSON.stringify({
  question: '已知二次函数 y = x² - 4x + 3，求顶点坐标'
});

console.log('发送请求到 http://localhost:3000/api/analyze');
console.log('请求体:', data);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log('收到响应，状态码:', res.statusCode);
  console.log('响应头:', JSON.stringify(res.headers));
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('响应体:', body);
  });
});

req.on('error', (e) => {
  console.error('请求错误:', e.message);
  console.error('错误类型:', e.code);
});

req.write(data);
req.end();
console.log('请求已发送');