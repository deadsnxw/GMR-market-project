const http = require('http');
const port = 5000;

const router = require('./routes/router');

const server = http.createServer((req, res) => {
  router(req, res);
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
