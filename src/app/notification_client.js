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
            callback: callback,
            registered: false
        };
    } else {
        eventmap[event].callback = callback;
    }

    //register to event messages from server
    if (connected) {
        if (!eventmap[event].registered) {
            eventmap[event].registered = true;
            ws.send('{' +
            '"event_type":"' + event + '",' +
            '"register" : true}');
        }
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

/**
 * registers for the events at the server after connection is established
 * @param event
 */
ws.onopen = function (event) {
    connected = true;
    for (var i in eventmap) {
        if (eventmap.hasOwnProperty(i)) {
            if (!eventmap[i].registered) {
                eventmap[i].registered = true;
                ws.send('{' +
                '"event_type":"' + i + '",' +
                '"register" : true}');
            }
        }
    }
};

/**
 * calls the callback if a message from the server arrives
 * @param event
 */
ws.onmessage = function (event) {
    var msg = JSON.parse(event.data);
    if (eventmap[msg.event_type]) {
        eventmap[msg.event_type].callback(msg.payload);
    }
};