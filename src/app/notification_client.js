//connect websocket connection to server
var ws = new WebSocket("ws://" + location.hostname + ":" + location.port + "/event");
var eventmap = {};
var connected = false;

/**
 * registers a callback to an event
 *
 * @param event name of the event you want to register to
 * @param callback function to call if event occurs
 */
function register_to_event(event, callback) {
    if (!eventmap[event]) {
        eventmap[event] = {
            callbacks: []
        };
        eventmap[event].callbacks.push(callback);
    } else {
        eventmap[event].callbacks.push(callback);
    }

    //register to event messages from server
    if (connected) {
        ws.send('{' +
        '"event_type":"' + event + '",' +
        '"register" : true}');
    }
}

/**
 * sends message for the event to the server
 *
 * @param event name of the event that occured
 * @param payload data you want to send to the server
 */
function send_event(event, payload) {

    //send event message to server
    ws.send('{' +
    '"event_type":"' + event + '",' +
    '"payload":' + payload + '}');
}

ws.onopen = function (event) {
    connected = true;
    for (var i in eventmap) {
        if (eventmap.hasOwnProperty(i)) {
            console.log("register")
            ws.send('{' +
            '"event_type":"' + i + '",' +
            '"register" : true}');
        }
    }
};

ws.onmessage = function (event) {
    var msg = JSON.parse(event.data);
    if (eventmap[msg.event_type]) {
        for (var i = 0; i < eventmap[msg.event_type].callbacks.length; i++) {
            eventmap[msg.event_type].callbacks[i](msg.payload);
        }
    }
};