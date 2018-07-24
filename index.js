const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

/**
 * Extension to MIME type map
 *
 * @type {Object}
 */
const MIME_TYPE_MAP = {
  '.css': 'text/css',
  '.doc': 'application/msword',
  '.htm': 'text/html',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
  '.swf': 'application/x-shockwave-flash',
  '.tiff': 'image/tiff',
  '.txt': 'text/plain',
  '.wav': 'audio/wav',
  '.xml': 'text/xml',
};

/**
 * Default MIME type
 *
 * @type {string}
 */
const DEFAULT_MIME_TYPE = 'text/plain';

/**
 * Default options
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  defaultFile: 'index.html',
  port: 8080,
  protocol: 'http',
  staticPath: './',
};

/**
 * Response headers for unknown/options request
 *
 * @type {Object}
 */
const UNKNOWN_METHOD_RESPONSE_HEADERS = { Allow: 'GET, HEAD', 'Content-Length': 0 };

/**
 * Perform http response
 *
 * @param {Object} response
 * @param {number} code
 * @param {Object} headers
 * @param {string|Buffer} [data]
 */
const respond = (response, code, headers, data) => {
  response.writeHead(code, headers, http.STATUS_CODES[code]);

  if (typeof data !== 'undefined') {
    response.write(data);
  }

  response.end();
};

/**
 * Get mime type according to request path
 *
 * @param {string} url
 * @returns {string}
 */
const getMimeType = (url) => MIME_TYPE_MAP[path.parse(url).ext] || DEFAULT_MIME_TYPE;

/**
 * Get if file is directory
 *
 * @param {string} url
 * @returns {boolean}
 */
const getIsDirectory = (url) => fs.statSync(url).isDirectory();

/**
 * Create server
 *
 * @param {Object} [customOptions] Options
 * @param {string} [customOptions.defaultFile] Path to default file (e.g. index.html) 
 * @param {string} [customOptions.staticPath] Path to the folder from where all files would be served
 * @param {number} [customOptions.port] HTTP port
 * @param {string} [customOptions.protocol] HTTP protocol (https or http)
 * @param {string} [customOptions.cert] Path to SSL cert file
 * @param {string} [customOptions.key] Path to SSL key file
 * @returns {http.Server|https.Server}
 */
const createServer = (customOptions = {}) => {
  const options = { ...DEFAULT_OPTIONS, ...customOptions };

  const responseHandler = (request, response) => {
    if (request.method === 'OPTIONS') {
      respond(response, 200, UNKNOWN_METHOD_RESPONSE_HEADERS);
      return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      respond(response, 405, UNKNOWN_METHOD_RESPONSE_HEADERS);
      return;
    }

    let requestPath = path.join(options.staticPath, path.normalize(url.parse(request.url).pathname));

    if (fs.existsSync(requestPath)) {
      if (getIsDirectory(requestPath)) {
        requestPath = path.join(requestPath, options.defaultFile);
      }

      const data = fs.readFileSync(requestPath);

      if (data instanceof Error) {
        respond(response, 500, { 'Content-Length': 0 });
      } else {
        respond(response, 200, { 'Content-type': getMimeType(requestPath), 'Content-length': data.length }, data);
      }
    } else {
      respond(response, 404, { 'Content-Length': 0 });
    }
  }

  const listenCallback = () => console.log(`Static server is listening ${options.protocol} requests on port ${options.port}`);

  if (options.protocol === 'http') {
    return http.createServer(responseHandler).listen(options.port, listenCallback)
  }

  return https.createServer({
    cert: fs.readFileSync(options.cert),
    key: fs.readFileSync(options.key),
  }, responseHandler).listen(options.port, listenCallback);
};

module.exports = createServer;
