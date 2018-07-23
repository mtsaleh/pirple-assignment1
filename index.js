/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// Instantiating the HTTP server
const httpServer = http.createServer(function(req, res){
  unifiedServer(req,res);
});

// Start the HTTP server, and have it listen on the given port
httpServer.listen(config.httpPort, function () {
  console.log('The http server is listening on port ' + config.httpPort + ' in ' + config.envName + ' mode now...');
});

// All the server logic for both the http and https server
const unifiedServer = function (req, res) {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url,true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });

  req.on('end', function() {
    buffer += decoder.end();

    // Choose the handler the request is should go to. If one is not found, use the notFound handler
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      'trimmedPath'       : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method'            : method,
      'headers'           : headers,
      'payload'           : buffer
    };

    // Route the request specified in the choosen handler
    chosenHandler(data, function(statusCode, payload) {
      // Use the statusCode returned by the handler, or use the default 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      // Use the payload returned by the handler, or use an empty object
      payload = typeof (payload) === 'object' ? payload : {};

      // Convert the payload to a string
      payloadString = JSON.stringify(payload);

      // Send the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the response
      console.log('Returning this response: ' + statusCode, payloadString);
    });

  });
};

// Define the handlers
const handlers = {};

// Ping handler
handlers.ping = function (data, callback) {
  // Callback the http status code 200
  callback(200);
};

// Hello handler
handlers.hello = function (data, callback) {
  // Callback the http status code hello
  callback(200, {'response' : 'Hello World!'});
};

// Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

// Define a request router
const router = {
  'ping'  : handlers.ping,
  'hello'  : handlers.hello
};

