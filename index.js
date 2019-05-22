//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
//Instantiate the httpServer
let httpServer = http.createServer(function(req,res){
//Get the url and parse it.
  let parsedUrl = url.parse(req.url,true);
//Get the path name.
  let path = parsedUrl.pathname;
  //Get the trimmedPath without any slashes.
  let trimmedPath = path.replace(/^\/+|\/+$/g,'');
//Get the payload if any
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data',function(data){
    buffer +=decoder.write(data);
  });
  req.on('end',function(){
    buffer += decoder.end();

    //Choose the handler
  let choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
  //letruct data object to send to handlers
  let data = {
    'trimmedPath': trimmedPath,
    'payload':buffer
  };

  //Route the request to thr handler specified in router
  choosenHandler(data,function(statusCode,payload){
  //use the statusCode calledback by the handler or default to 200
  statusCode = typeof(statusCode) == 'number' ? statusCode: 200;

  //use the payload callled back by the handler or default to empty Object
  payload = typeof(payload) == 'object' ? payload: {};
  //Convert the payload to a string_decoder
  let payloadString = JSON.stringify(payload);
  //Return the response
  res.setHeader('Content-type', 'application/json');
  res.writeHead(statusCode);
  res.end(payloadString);

  //Log the data
  console.log('Returning response' , statusCode,payloadString);
  });
    //Log the data
    console.log('Request with payload' , buffer);
    //Send the response
    res.end("Hello World\n");
  });
});
//Start the server and listen to port
httpServer.listen(config.httpPort, function(){
  console.log('Server is listening on port' +config.httpPort+ 'in' +config.envName+ 'now');
});


//Define the handlers
let handlers = {};
//Hello handler
handlers.hello = function(data,callback){
  //Callback a http status code an a payload object
  callback(406, {'message':'Welcome to NodeJS Hello World'});
}

//Not Found handler
handlers.notFound = function(data,callback){
  callback(404);
}

//Define a request router
let router = {
  'hello': handlers.hello
};
