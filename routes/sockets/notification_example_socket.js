var passport = require('../../config/passport');
var clients = [];
var anzClients = 0;

function notificationsocket(app) {
    app.ws('notification_example', function (ws, req) {
        if (!req.isAuthenticated()) {
            ws.close();
            return;
        }
        clients[anzClients] = ws;
        anzClients++;
        ws.on('message', function (data) {
            var msg = JSON.parse(data);
            for (var i = 0; i < anzClients; i++) {
                clients[i].send(msg.message, function (err) {
                    if (err) {
                        clients.splice(i, 1);
                        i--;
                        anzClients--;
                    }
                });
            }
        });
    });
};

module.exports.sock = notificationsocket;