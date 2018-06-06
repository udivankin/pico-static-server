# Pico-static-server
Tiny yet fully functional Node.js static files server with zero dependencies and *HTTPS* support.

### Install
Via npm:

```bash
npm install --save pico-static-server
```

### Example

You can start right away by running 
```bash
node ./examples/pico-http-server.js
```
assuming you've put your content into ``./examples/static/`` folder.

*HTTPS* example requires you to generate SSL cerificates first:
Generate 2048-bit RSA private key and remove the password from generated key
```bash
openssl genrsa -des3 -passout pass:x -out localhost.pem 2048 && openssl rsa -passin pass:x -in localhost.pem -out localhost.key && rm localhost.pem
```
Generate a Certificate Signing Request (CSR)
```bash
openssl req -new -key localhost.key -out localhost.csr
```
Generate a self-signed certificate that is valid for 365 days with sha256 hash and remove CSR
```bash
openssl x509 -req -sha256 -days 365 -in localhost.csr -signkey localhost.key -out localhost.crt && rm localhost.csr
```

Then install generated certificate in system, mark as trusted and you are ready:
```bash
node ./examples/pico-https-server.js
```

### Usage

You may want to create your own static HTTP server:

```javascript
  const createServer = require('pico-static-server');

  const staticServer = createServer({
    defaultFile: 'index.html',  // defaults to 'index.html'
    staticPath: './static',     // defaults to './'
    port: 8080,                 // defaults to 8080
  });
```
or even *HTTPS* one: 
```javascript
  const createServer = require('pico-static-server');

  const staticServer = createServer({
    defaultFile: 'index.html',  // defaults to 'index.html'
    staticPath: __dirname + '/static',     // defaults to './'
    port: 8080,                 // defaults to 8080
    protocol: 'https',          // defaults to 'http'
    cert: __dirname + '/localhost.crt',
    key: __dirname + '/localhost.key',
  });
```

createServer() returns an instance of [http.Server](https://nodejs.org/api/http.html) or [https.Server](https://nodejs.org/api/https.html) to give you control over it if needed

MIT found in `LICENSE` file.
