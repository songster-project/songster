angular.module("songster.notificationClient", []).
    factory("nClient", function () {
        //connect websocket connection to server
        var ws;
        //used to map event to callback
        var eventmap = {};
        var connected = false;
        var connectatempts = 1;
        var service = {};
        setupsocketconnection();

        /**
         * registers a callback to an event
         *
         * @param event name of the event you want to register to
         * @param callback function to call if event occurs
         */
        service.register_to_event = function register_to_event(event, callback) {
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
        };

        /**
         * sends message for the event to the server
         *
         * @param event name of the event that occured
         * @param payload data you want to send to the server as JSON
         */
        service.send_event = function send_event(event, payload) {
            ws.send('{' +
            '"event_type":"' + event + '",' +
            '"payload":' + payload + '}');
        };

        function setupsocketconnection() {
            ws = new WebSocket("ws://" + location.hostname + ":" + location.port + "/event");

            /**
             * registers for the events at the server after connection is established
             */
            ws.onopen = function () {
                connectatempts = 1;
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
             *
             * @param event
             */
            ws.onmessage = function (event) {
                var msg = JSON.parse(event.data);
                if (eventmap[msg.event_type]) {
                    eventmap[msg.event_type].callback(msg.payload);
                }
            };

            /**
             * reconnects to the server if websocket connection is closed
             */
            ws.onclose = function () {
                connected = false;
                for (var i in eventmap) {
                    if (eventmap.hasOwnProperty(i)) {
                        eventmap[i].registered = false;
                    }
                }
                var waittime = getnextWaitingtime(connectatempts);
                setTimeout(function () {
                    connectatempts++;
                    setupsocketconnection();
                }, waittime);
            };
        }

        /**
         * use Exponential backoff to get time for the next reconnect attempt
         *
         * @param k number of attempts
         * @returns {number} waiting time
         */
        function getnextWaitingtime(k) {
            if (k > 7) {
                k = 7;
            }
            return Math.random() * (Math.pow(2, k) - 100);
        }

        return service;
    });