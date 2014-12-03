var nserver = require('./../../lib/notification_server');
var clients = new Array();

nserver.register_Event('lala', function (ws,req, payload) {
    nserver.send_Notifications('lala',payload,clients);
});

nserver.register_User('lala', function (ws,req, payload) {
    clients.push(ws);
});
