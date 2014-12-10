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
         * @param payload data you want to send to the server on registration
         */
        service.register_to_event = function register_to_event(event, callback, payload) {
            if (!eventmap[event]) {
                eventmap[event] = {
                    callback: callback
                };
            } else {
                eventmap[event].callback = callback;
            }
            if (payload) {
                eventmap[event].payload = payload;
            }

            //register to event messages from server
            if (connected) {
                var resp = {
                    event_type: event,
                    register: true,
                    payload: eventmap[event].payload
                };
                ws.send(JSON.stringify(resp));
            }
        };

        /**
         * sends message for the event to the server
         *
         * @param event name of the event that occured
         * @param payload data you want to send to the server
         */
        service.send_event = function send_event(event, payload) {
            var event_message = {
                event_type: event,
                payload: payload
            };
            ws.send(JSON.stringify(event_message));
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
                        var resp = {
                            event_type: i,
                            register: true,
                            payload: eventmap[i].payload
                        };
                        ws.send(JSON.stringify(resp));
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
            if (k > 10) {
                k = 10;
            }
            return Math.random() * (Math.pow(2, k) * 10);
        }

        return service;
    });