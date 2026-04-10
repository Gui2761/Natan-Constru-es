import http from 'http';

function testPost() {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  let body = '';
  
  const fields = {
    name: 'Teste 11',
    description: 'Desc',
    basePrice: '120',
    salePercentage: '10',
    stock: '50',
    weight: '15.5',
    categoryId: '4' // Pisos
  };
  
  for (const key in fields) {
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
    body += `${fields[key]}\r\n`;
  }
  body += `--${boundary}--\r\n`;

  const requestInfo = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/products',
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const req = http.request(requestInfo, (res) => {
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      console.log('Status Code POST:', res.statusCode);
      console.log('Response Body POST:', rawData);
    });
  });

  req.on('error', (e) => {
    console.error(`Status Error: ${e.message}`);
  });

  req.write(body);
  req.end();
}

function testPut() {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  let body = '';
  const fields = { name: 'Update 11', basePrice: '120', stock: '50', categoryId: '4' };
  
  for (const key in fields) {
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
    body += `${fields[key]}\r\n`;
  }
  body += `--${boundary}--\r\n`;

  const requestInfo = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/products/3', // assuming ID 3 exists, if not we get 400
    method: 'PUT',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const req = http.request(requestInfo, (res) => {
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      console.log('Status Code PUT:', res.statusCode);
      console.log('Response Body PUT:', rawData);
    });
  });

  req.on('error', (e) => {
    console.error(`Status Error PUT: ${e.message}`);
  });

  req.write(body);
  req.end();
}

setTimeout(testPost, 100);
setTimeout(testPut, 2000);
