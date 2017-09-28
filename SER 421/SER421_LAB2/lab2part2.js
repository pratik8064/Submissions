var http = require('http');
var url = require('url');

var options = {
    server: 'www.httpbin.org',
    path: '/',
    port: '80',
    method: 'GET',
    max_requests: '5',
    local_port: '8080'
};

const windowTime = 10 * 60 * 1000;

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
        var currentTime = new Date();
        var difference = getDifference(cookie);
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
    var location = response.headers['location'];
    if (typeof location !== 'undefined' && location.startsWith('https')) {
        return true;
    }
    return false;
}

http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    var reqPath = urlObj.path;
    var reqOptions = {
        host: options.server,
        path: reqPath,
        port: options.port,
        method: req.method
    };
    if (req.method == 'POST') {
        reqOptions.headers = {};
        reqOptions.headers['content-length'] = req.headers['content-length'];
        reqOptions.headers['content-type'] = req.headers['content-type'];
    }

    var cookie = getParsedCookies(req);
    var firstRequest = false;

    if (isEmpty(cookie) || cookie.requestCount == undefined) {
        firstRequest = true;
    }

    var cookieArray = getCookieArray(cookie, firstRequest);
    if (!firstRequest && parseInt(cookie.requestCount) >= options.max_requests) {
        res.setHeader("Content-Type", "text/html");
        addCookies(res, cookieArray);
        res.writeHead(429, "Max Request Reached", res.headers);
        res.end('<html><head><title>Http Response Code: 429 </title></head>' + '<body><h1>max request reached !!!</h1></body></html>');
    } else {
        var remoteRequest = http.request(reqOptions, function (response) {
            addCookies(response, cookieArray);
            var respDat = '';
            var respBinDat = [];
            const contentType = response.headers['content-type'];
            response.on('data', function (chunk) {
                if (typeof contentType != 'undefined' && (contentType.includes('image') || contentType.includes('video') || contentType.includes('audio'))) {
                    respBinDat.push(chunk);
                } else {
                    respDat += chunk;
                }
            });
            response.on('end', function () {
                if (response.statusCode >= 300 && response.statusCode < 400 && isSecure(response)) {
                    addCookies(response, cookieArray);
                    res.writeHead(505, "Error: https redirects not supported",response.headers);
                    res.end("<HTML><HEAD></HEAD><BODY><h1>Error code: " + 505 + " </h1></BODY></HTML>");
                } else {
                    addCookies(response, cookieArray);
                    res.writeHead(response.statusCode, response.statusMessage, response.headers);
                    if (typeof contentType !== 'undefined' && (contentType.includes('image') || contentType.includes('video') || contentType.includes('audio'))) {
                        res.end(Buffer.concat(respBinDat));
                    } else {
                        res.end(respDat);
                    }
                }
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });

        if (req.method == 'POST') {
            var jsonData = "";

            req.on('data', function (chunk) {
                jsonData += chunk;
            });
            req.on('end', function () {
                console.log(jsonData);
                remoteRequest.write(jsonData);
                remoteRequest.end();
            });
        } else {
            remoteRequest.end();
        }

    }

}).listen(options.local_port);

console.log("Server started");
