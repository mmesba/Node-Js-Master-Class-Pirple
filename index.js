 /*
 * Title: Primary or index file for Api
* Description: App's starting file 
* Author: Mohammad Mesbaul Haque
* Github link: https://github.com/mmesba/pirple-nodejs
* Date: 16/12/2021
*/
 
// Dependencies
const http = require('http');
const url = require('url');
const {StringDecoder } = require('string_decoder');
const config = require('./config'); 

// App object or Module scaffolding. 
 
// main functions or objects.


 
 
// Create a server
let server = http.createServer((req, res)=>{
    // Get the url and parse it
    let parsedUrl = url.parse(req.url, true);
    // Get the path 
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g,'')
    let method = req.method;
    let queryStringObject = parsedUrl.query
    let headers = req.headers;

    // Get the payload
    let decoder = new StringDecoder('utf-8');
    let buffer = ''; 
    req.on('data', (data)=>{
        buffer += decoder.write(data)
    })
    req.on('end', ()=>{
        buffer += decoder.end();

        // Choose the handler this request should go to . If one is not found use the not found handler
        let chosenHandler  = typeof(router[trimmedPath])  !== 'undefined' ? router[trimmedPath] : handlers.notFoundHandler;

        // Construct the data object to send to the handler
        let data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method': method,
            'headers' : headers,
            'payload': buffer
        };

        // Route the request to the handler specified in the router
        // Chosen handler now holds the value of a function which will be called as users request.
        chosenHandler(data, (statusCode, payload)=>{
            // Use the status code called back by the handler , or default 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            // Use the payload called back by the handler , or default to an empty object.
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to an empty string
            let payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log(`Returning this response ${statusCode} ${payloadString} `);
        })
})
})

// Start the server, and have it listen on port 3000
server.listen(config.port, ()=>{
    console.log(`Server is listening port ${config.port} in ${config.envName}`  );
})

// Define handler
let handlers = {};

// Sample handler
handlers.sample = (data, callback)=>{
    // Callback a http status code, and a payload object
    callback(403, {'name': 'sample handler'})
}

handlers.notFoundHandler = (data, callback)=>{
    callback(404)
}


// Define a request router
var router = {
    'sample': handlers.sample
}


 // export the module. 
// module.exports = ; 