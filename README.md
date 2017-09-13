# Pico-static-server
Tiny yet fully functional functional Node.js static files server with zero dependencies written with ES6.

## Install
Via npm:

```
npm install --save pico-static-server
```

## Usage

```javascript
  const createServer = require('pico-static-server');

  // createServer returns an instance of [http.Server](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_server) to give you control over it if needed
  const staticServer = createServer({
    defaultFile: 'index.html', // not required, defaults to 'index.html'
    staticPath: './static',    // not required, defaults to './'
    port: 8080,                // not required, defaults to 8080
  });
```
MIT found in `LICENSE` file.
