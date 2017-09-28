var http = require('http');
var url = require('url');

var options = {
//        host: '192.168.0.16',
//    host: 'www.httpbin.org',
    //  host: 'www.tutorialspoint.com',
    server: 'www.baeldung.com',
    //host: 'www.asu.edu',
    path: '/',
    port: '80',
    method: 'GET',
    max_requests: 50,
    freshness: 1000 * 60 * 2,
    cache_size: '500',
    local_port: '8080'
};

var LRU = require("lru-cache"),
    lru_options = {
        max: options.cache_size
            /*, length: function (n, key) { return n * 2 + key.length; }
            , dispose: function (key, n) { n.close(); }*/
            ,
        maxAge: 1000 * 40
    },
    cache = LRU(lru_options),
    otherCache = LRU(50);


const windowTime = 2 * 60 * 1000;

function getParsedCookies(request) {

    var cookies = {};
    var requestCookies = request.headers.cookie;

    if (requestCookies) {
        requestCookies.split(';').forEach(function (cookie) {
            var chunk = cookie.split('=');
            cookies[chunk.shift().trim()] = decodeURI(chunk.join('='));
        });
    }

    return cookies;
}

function getDifference(cookie) {
    var firstTime = parseInt(cookie.firstRequestTime);
    return (new Date().getTime() - firstTime);
}

function getCookieArray(cookie, firstRequest) {
    var cookieArray = [];
    var maxTimeReached = false;
    if (!firstRequest) {
        //var firstTime = parseInt(cookie.firstRequestTime);
        //console.log(cookie);
        //console.log("-------------");
        var currentTime = new Date();
        //var difference = currentTime.getTime() - firstTime;
        var difference = getDifference(cookie);
        //console.log("milisecond diff -- " + difference);
        if (difference >= windowTime) {
            maxTimeReached = true;
        }
    }
    if (firstRequest || maxTimeReached) {
        cookieArray.push("requestCount=1");
        cookie.requestCount = 1;
        var currentTime = new Date().getTime();
        cookieArray.push("firstRequestTime=" + currentTime);
    } else {
        var count = parseInt(cookie.requestCount);
        count = count + 1;
        cookieArray.push("requestCount=" + count);
        var firstTime = parseInt(cookie.firstRequestTime);
        cookieArray.push("firstRequestTime=" + firstTime);
        //console.log("new count = " + count);
    }
    return cookieArray;
}

function addCookies(response, newCookies) {
    if (typeof response.headers === 'undefined') response.headers = {};
    var oldCookies = response.headers['Set-Cookie'];
    if (oldCookies == undefined || oldCookies.length == 0) {
        response.headers['Set-Cookie'] = newCookies;
    } else {
        var newArray = [];
        oldCookies.forEach(function (item) {
            if (!item.startsWith("requestCount") && !item.startsWith("firstRequestTime")) {
                newArray.push(item);
            }
        });
        //console.log(newArray);
        oldCookies = newArray;
        newCookies.forEach(function (item) {
            oldCookies.push(item);
        });
        response.headers['Set-Cookie'] = oldCookies;
    }
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function isSecure(response) {
    //console.log("checking if secure");
    var location = response.headers['location'];
    //console.log(location);
    if (typeof location !== 'undefined' && location.startsWith('https')) {
        //console.log("is secure");
        return true;
    }
    //console.log("not secure");
    return false;
}

/*******************************
CACHE implementation begins here
**********************************/

function getFromCache(req, res, cookieArray) {
    console.log("cache hit");
    var cacheRes = cache.get(req.method + ' ' + req.url);
    var contentType = cacheRes.headers['content-type'];
    addCookies(cacheRes, cookieArray);
    res.writeHead(cacheRes.statusCode, cacheRes.statusMessage, cacheRes.headers);
    console.log("-------------------------------------------------------------"+typeof cacheRes.payload);
    if (typeof contentType !== 'undefined' && (contentType.includes('image') || contentType.includes('video') || contentType.includes('audio'))) {
        //console.log("Responding with image data");
        res.end(Buffer.concat(cacheRes.payload));
    } else {
        //console.log("Responding with string data");
        res.end(cacheRes.payload);
    }

}


/*******************************
CACHE implementation ensd here
**********************************/

http.createServer(function (req, res) {
    //setInterval(myTimer, 2000);
    var urlObj = url.parse(req.url, true, false);
    var reqPath = urlObj.path;
    var reqOptions = {
        host: options.server,
        path: reqPath,
        port: options.port,
        method: req.method
    };

    if (req.url.includes('/admin')) {
        if (req.method == 'POST' && req.url == '/admin/reset') {
            cache.reset();
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end("<HTML><HEAD></HEAD><BODY><h3> Cache reset invoked </h3></BODY></HTML>");

        }
        if (req.method == 'DELETE' && req.url.includes('/admin/cache')) {
            //console.log(req.url.substr(req.url.indexOf('=')+1));
            //console.log(typeof req.url);
            var key = req.url;
            key = key.replace(/%20/g, " ");
            key = key.replace(/\?/g, " ");
            key = key.substr(key.indexOf('=') + 1);
            //console.log(cache.peek(key));
            if (typeof (cache.peek(key)) !== 'undefined') {
                cache.del(key);
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end("<HTML><HEAD></HEAD><BODY><h3> Cache item with key " + key + " deleted. </h3></BODY></HTML>");
            } else {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(404);
                res.end("<HTML><HEAD></HEAD><BODY><h3> Cache item with key " + key + " does not exist. </h3></BODY></HTML>");
            }
        }

        if (req.method == 'GET' && req.url.includes('/admin/cache')) {
            //console.log(req.url.substr(req.url.indexOf('=')+1));
            //console.log(typeof req.url);
            //console.log("GET wala");
            var key = req.url;
            key = key.replace(/%20/g, " ");
            key = key.replace(/\?/g, " ");
            key = key.substr(key.indexOf('=') + 1);
            //console.log(cache.peek(key));
            if (typeof (cache.peek(key)) !== 'undefined') {
                //cache.del(key);
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end("<HTML><HEAD></HEAD><BODY><h3> Cache item with key " + key + " and value " + JSON.stringify(cache.peek(key)) + " </h3></BODY></HTML>");
            } else {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(404);
                res.end("<HTML><HEAD></HEAD><BODY><h3> Cache item with key " + key + " does not exist. </h3></BODY></HTML>");
            }
        }

        if (req.method == 'PUT' && req.url.includes('/admin/cache') && req.url.includes('key=') && req.url.includes('value=')) {
            //console.log(req.url.substr(req.url.indexOf('=')+1));
            //console.log(req.url);
            var key = req.url;
            //console.log(key);
            key = key.replace(/%20/g, " ");
            key = key.replace(/\?/g, " ");
            //console.log(key);
            key1 = (key.slice(key.indexOf('key=') + 4, key.indexOf('&'))).trim();
            key = key.replace(/&/g, " ");
            //console.log("key: " + key1);
            var value = key.substr(key.indexOf('value=') + 6).trim();
            //console.log(key);
            //console.log(value);
            if (typeof (cache.peek(key1)) !== 'undefined') {
                //cache.del(key);
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                cache.set(key1, value);
                res.end("<HTML><HEAD></HEAD><BODY><h3> Cache item with key " + key1 + " exists and is replaced. </h3></BODY></HTML>");
            } else {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                cache.set(key1, value);
                res.end("<HTML><HEAD></HEAD><BODY><h3> Cache item with key " + key1 + " was created. </h3></BODY></HTML>");
            }
        }
    } else {
        if (req.method == 'POST') {
            reqOptions.headers = {};
            reqOptions.headers['content-length'] = req.headers['content-length'];
            reqOptions.headers['content-type'] = req.headers['content-type'];
        }


        //reqOptions.headers = req.headers;
        //console.log(reqOptions);
        //console.log("Request received");
        //console.log("urltypr: " + typeof (req.url));
        //console.log("CACHE STATUS : " + typeof (JSON.stringify(cache.peek(req.method + ' ' + req.url))));

        var cookie = getParsedCookies(req);
        var firstRequest = false;

        if (isEmpty(cookie) || cookie.requestCount == undefined) {
            //console.log("first request...................................");
            firstRequest = true;
        }

        var cookieArray = getCookieArray(cookie, firstRequest);
        if (!firstRequest && parseInt(cookie.requestCount) >= options.max_requests) {
            //console.log("NOT ALLOWED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            res.setHeader("Content-Type", "text/html");
            addCookies(res, cookieArray);
            res.writeHead(429, "Max Request Reached", res.headers);
            res.end('<html><head><title>Error: '+429+'</title></head>' + '<body><h1>max request reached !!!</h1></body></html>');

        } else {
            //console.log("allowing this client's request " + req.headers.host);
            if (typeof (cache.get(req.method + ' ' + req.url)) !== 'undefined' && req.method !== 'POST') {
                getFromCache(req, res, cookieArray);
            } else {
                var remoteRequest = http.request(reqOptions, function (response) {
                    addCookies(response, cookieArray);
                    var respDat = '';
                    var respBinDat = [];
                    const contentType = response.headers['content-type'];
                    response.on('data', function (chunk) {
                        if (typeof contentType != 'undefined' && (contentType.includes('image') || contentType.includes('video') || contentType.includes('audio'))) {
                            //console.log("Adding binary payload");
                            respBinDat.push(chunk);
                        } else {
                            //console.log("Adding string payload");
                            respDat += chunk;
                        }
                        //console.log(chunk);
                    });
                    response.on('end', function () {
                                                
                        //console.log(response.statusCode);
                        //cache.set(req.method + ' '+req.url,response);
                        //console.log("cached data : " + cache.get(req.method + ' ' + req.url));
                        //console.log("cache state : " + cache);
                        if (response.statusCode >= 300 && response.statusCode < 400 && isSecure(response)) {
                            //console.log("https 300 level aya");
                            addCookies(response, cookieArray);
                            res.writeHead(505, "Error: https redirects not supported",response.headers);
                            res.end("<HTML><HEAD></HEAD><BODY><h1>Error code: " + 505 + " </h1></BODY></HTML>");
                        }
                        /*else if(response.statusCode>=400 && response.statusCode<500){
                                            console.log("400 level aya");
                                            res.end("<HTML><HEAD></HEAD><BODY><h1>Error code: 404</h1></BODY></HTML>");
                                        }*/
                        else {
                            var cacheRes = {};
                            cacheRes.statusCode = response.statusCode;
                            cacheRes.statusMessage = response.statusMessage;
                            cacheRes.headers = response.headers;
                            addCookies(response, cookieArray);
                            res.writeHead(response.statusCode, response.statusMessage, response.headers);
                            if (typeof contentType !== 'undefined' && (contentType.includes('image') || contentType.includes('video') || contentType.includes('audio'))) {
                                //console.log("Responding with image data");
                                cacheRes.payload = respBinDat;
                                cache.set(req.method + ' ' + req.url, cacheRes);
                                res.end(Buffer.concat(respBinDat));
                            } else {
                                //console.log("Responding with string data");
                                cacheRes.payload = respDat;
                                cache.set(req.method + ' ' + req.url, cacheRes);
                                res.end(respDat);
                            }
                        }
                    });
                    //console.log("Response sent");
                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                });


                if (req.method == 'POST') {
                    var jsonData = "";
                    req.on('data', function (chunk) {
                        //console.log("Getting Json chunks from client");
                        jsonData += chunk;
                    });
                    req.on('end', function () {
                        //console.log("writing Json to payload of remote server");
                        remoteRequest.write(jsonData);
                        remoteRequest.end();
                    });
                } else {
                    //console.log("making request. waiting for response.....")
                    remoteRequest.end();
                }
            }
        }
    }
}).listen(options.local_port);

function myTi() {
    //console.log("Its pruning time");
    cache.prune();
}

var mytime = setInterval(myTi, options.freshness);

console.log("Server started");
