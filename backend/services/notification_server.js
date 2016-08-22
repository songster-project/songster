//array to store the middleware instances
var wsMiddlewares;
//map to store the callbacks as key, the eventname is used
var instancemap;
var cookieParser=require('cookie-parser');
var session=require('express-session');
var passport=require('passport');
var settings=require('../../config/settings.js');
var MongoStore=require('connect-mongo')(session);
var app=require('../../app');

/**
 * used to parse a request through the middleware
 *
 * @param middlewares the middleware you want to parse the request through
 * @param request the request you want to parse through the middleware
 * @param callback function that should be called afterwards
 */
function parsemiddleware(middlewares, request, callback) {
    var req = request;
    var response = {writeHead: {}};
    var idx = 0;
    if (!request._passport) {
        (function next(err) {
            if (err) {
                return;
            }
            var cur = middlewares[idx];
            idx += 1;
            if (cur) {
                cur(req, response, next);
            } else {
                callback(req);
            }
        }());
    } else {
        callback(req);
    }
}

/**
 * initializes the WebsocketServer
 */
module.exports = function () {
    wsMiddlewares = [];
    instancemap = {};
    /*
     * initialize middlware for websockets
     */
    wsMiddlewares.push(cookieParser(settings.cookie_secret));
    wsMiddlewares.push(session({
        secret: settings.cookie_secret,
        store: new MongoStore({
            db: settings.db,
            host: settings.db_host,
            port: settings.db_port,
            username: settings.db_user,
            password: settings.db_pass,
            auto_reconnect: true
        }),
        saveUninitialized: true,
        resave: true
    }));
    wsMiddlewares.push(passport.initialize());
    wsMiddlewares.push(passport.session());

    app.ws('event', function (ws, req) {
        return; // FIXME
        ws.on('message', function (data) {
            //parse the request through the middleware after the first message was sent otherwise it would block the connection for too long
            parsemiddleware(wsMiddlewares, req,
                function (request) {
                    var msg = JSON.parse(data);
                    if (instancemap[msg.event_type]) {
                        instancemap[msg.event_type].register_User_callbacks.forEach(function (entry) {
                            entry(ws, request, msg.payload);
                        });
                    }
                });

        });
    });
};

/**
 * function gets called if a new user registers to an event
 * used to get the users you want to send messages to
 *
 * @param event_type name of the event a user can register to hast to be a string
 * @param callback function that should be called if a new user registers
 */
module.exports.register_to_UserRegistrations = function register_to_UserRegistrations(event_type, callback) {
    if (!instancemap[event_type]) {
        instancemap[event_type] = {event_callbacks: [], register_User_callbacks: []};
    }
    instancemap[event_type].register_User_callbacks.push(callback);
};

/**
 * sends a notification for the event event_type
 *
 * @param event_type the name of the event you want to send a notification to
 * @param payload the data you want to send to the client
 * @param clients the clients you want to send a notification
 */
module.exports.send_Notifications = function send_Notifications(event_type, payload, clients) {
    var msg = {
        event_type: event_type,
        payload: payload
    };
    for (var i = 0; i < clients.length; i++) {
        clients[i].send(JSON.stringify(msg), function (err) {
            if (err) {
                clients.splice(i, 1);
                i--;
            }
        });

    }
};