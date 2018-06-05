const createServer = require('pico-static-server');

const staticServer = createServer({
  defaultFile: 'defaultfile.html',   // defaults to 'index.html'
  staticPath: __dirname + '/static', // defaults to './'
  port: 8080,                        // defaults to 8080
});

// Try opening http://localhost:8080/