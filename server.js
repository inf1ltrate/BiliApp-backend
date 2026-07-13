const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // 处理请求路径
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './simple.html';
  }

  // 确定文件类型
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // 读取文件并返回
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == 'ENOENT') {
        // 文件不存在
        res.writeHead(404);
        res.end('File not found');
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      // 文件存在，返回文件内容
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = process.env.PORT || 8089;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});