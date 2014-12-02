var nserver = require('./../../lib/notification_server');
var clients = new Array();

nserver.register_Event('lala', function (ws,req, payload) {
    console.log('callback');
    nserver.send_Notifications('lala',payload,clients);
});

nserver.register_User('lala', function (ws,req, payload) {
    console.log('new user');
    clients.push(ws);
});
