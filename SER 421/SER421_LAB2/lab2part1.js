//var sleep = require('sleep');
var http = require('http');
var url = require('url');
var options = {
  server: 'www.baeldung.com',
  path: '/',
  port: 80,
  method: 'GET',
  local_port: '8080'
};

http.createServer(function(req, res){
    var urlObj = url.parse(req.url, true, false);
    var reqPath = urlObj.path;
    //var reqOptions = JSON.parse(JSON.stringify(options));
    var reqOptions = {
        host: options.server,
        path: reqPath,
        port: options.port,
        method: req.method
    };
    
    if(req.method != 'GET'){
        //console.log(req.method);
        res.writeHead(405, req.method+" Method Not Allowed");
        res.end("<HTML><HEAD></HEAD><BODY><h1>405 " + req.method+ " Method Not Allowed </h1></BODY></HTML>");
    }else{
        var req = http.request(reqOptions, function(response){
            var respDat = '';
            response.on('data', function(chunk){
                respDat += chunk;
            });
            response.on('end', function(){
                //console.log(response.statusCode);
                if(response.statusCode>=300 && response.statusCode<400){
                    res.writeHead(response.statusCode, response.statusMessage);
                    res.end("<HTML><HEAD></HEAD><BODY><h1>Error code: " +response.statusCode+" </h1></BODY></HTML>");
                }
                else{
                    res.writeHead(response.statusCode, response.statusMessage, response.headers);
                    res.end(respDat);
                }
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
        req.end();
    }
    
}).listen(options.local_port);

console.log("Server started");