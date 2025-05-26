const http = require('http');

const apiRouter = require('./routes/apiRouter');
const webRouter = require('./routes/webRouter');

const server = http.createServer((req, res) => {
  req.url.startsWith('/api') ? apiRouter(req, res) : webRouter(req, res)
});

const port = 5000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
