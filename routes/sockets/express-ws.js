var path = require('path');
var http = require('http');
var WebSocketServer = require('ws').Server;
var middle = require('../../app').middleware;
var app;
var server;
/*
 * modified version of HenningM's express-ws
 * https://github.com/HenningM/express-ws
 */
module.exports = function (appllication) {
    app=appllication;
    server = http.createServer(app);
    app.listen = function()
    {
        return server.listen.apply(server, arguments)
    }
    app.ws = addSocketRoute;
};

function addSocketRoute(route, middleware, callback) {
    var args = [].splice.call(arguments, 0);

    if (args.length < 2)
        throw new SyntaxError('Invalid number of arguments');

    middle.push(middleware);
    if (args.length > 2) {
        middle.push(callback);
    }

    var wss = new WebSocketServer({
        server: server,
        path: path.join(app.mountpath, route)
    });
    wss.on('connection', function(ws) {

        var response = {writeHead: {}};
        ws.upgradeReq.method = 'WS';

        app.handle(ws.upgradeReq, response, function(err) {
            var idx = 0;
            (function next (err) {
                if (err) return;
                var cur = middle[idx++];
                if (!middle[idx]) {
                    cur(ws, ws.upgradeReq);
                } else {
                    cur(ws.upgradeReq, response, next);
                }
            }());
        });
    });
};