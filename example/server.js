  const createServer = require('pico-static-server');

  const staticServer = createServer({
    defaultFile: 'defaultfile.html', // not required, defaults to 'index.html'
    staticPath: './static',          // not required, defaults to './'
    port: 8080,                      // not required, defaults to 8080
  });

  // Try opening http://localhost:8080/