const http = require('http');
const queryDatabase = require('./index.js');

const server = http.createServer((req, res) => {

  if (req.method === 'GET') {

    if (req.url.match('/\([0-9]+)')) {
      queryDatabase(req, res)
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Page not found.');
    }
  } else if (req.method === 'POST') {
    

  } else if (req.method === 'PUT') {
   
  
} else if (req.method === 'DELETE') {
   
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});