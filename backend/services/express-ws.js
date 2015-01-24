var path = require('path');
var http = require('http');
var WebSocketServer = require('ws').Server;
var app = require('../../app');

/*
 * modified version of HenningM's express-ws
 * https://github.com/HenningM/express-ws
 */
module.exports = function () {
    var server = http.createServer(app);
    app.listen = function () {
        return server.listen.apply(server, arguments);
    };
    function addSocketRoute(route, middleware, callback) {
        //var args = [].splice.call(arguments, 0);
        var middle = [];

        middle.push(middleware);

        var wss = new WebSocketServer({
            server: server,
            path: path.join(app.mountpath, route)
        });

        wss.on('connection', function (ws) {

            var response = {writeHead: {}};
            ws.upgradeReq.method = 'WS';

            app.handle(ws.upgradeReq, response, function (err) {
                var idx = 0;
                (function next(err) {
                    if (err) {
                        return;
                    }
                    var cur = middle[idx++];
                    if (!middle[idx]) {
                        cur(ws, ws.upgradeReq, wss);
                    }
                }());
            });
        });

        return wss;
    }

    app.ws = addSocketRoute;
};