const createServer = require('./../index.js');

const staticServer = createServer({
  defaultFile: 'defaultfile.html',   // defaults to 'index.html'
  staticPath: __dirname + '/static', // defaults to './'
  port: 8080,                        // defaults to 8080
  protocol: 'https',                 // defaults to 'http'
  cert: __dirname + '/localhost.crt',
  key: __dirname + '/localhost.key',
});

// Try opening https://localhost:8080/