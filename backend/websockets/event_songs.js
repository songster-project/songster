var nserver = require('../services/notification_server');
var db = require('../../config/database');
var eventmap = {};
//number of previous songs to send
var MAX_NUM_PREV_SONGS = 7;
//number of next songs to send
var MAX_NUM_NEXT_SONGS = 5;


/*
 sends the new songs to the clients
 */
function sendSongs(id, clients) {
    var response = {
        lastSongs: [],
        nextSongs: []
    };
    db.EventLog.find({
        event_id: id,
        type: 'songplayed'
    }).sort('-logDate').limit(MAX_NUM_PREV_SONGS + 1).exec(function (err, logEntries) {
            if (err) {
                console.log(err);
                return;
            }
            if (logEntries && logEntries.length>0) {

                if (logEntries[0].message) {
                    var msg = logEntries[0].message;
                    if (msg.nextSongs) {
                        response.nextSongs = msg.nextSongs.slice(0,MAX_NUM_NEXT_SONGS);
                    }
                }
                logEntries.forEach(function (entry) {
                    response.lastSongs.push(entry.message.currentSong);
                });
                if (response.lastSongs.length > 0) {
                    response.currentSong = response.lastSongs[0];
                    response.lastSongs.splice(0, 1);
                }
            }
            nserver.send_Notifications('music_changed', response, clients);
        }
    );
}

/*
 * get registrations for music_changed event
 */
nserver.register_to_UserRegistrations('music_changed', function (ws, req, data) {
    ws.on('close', function () {
        if (eventmap[data.eventid]) {
            if (eventmap[data.eventid].clients.indexOf(ws) >= 0) {
                eventmap[data.eventid].clients.splice(eventmap[data.eventid].clients.indexOf(ws), 1);
            }
        }
    });
    if (eventmap[data.eventid]) {
        //check if client is already registered
        if (eventmap[data.eventid].clients.indexOf(ws) === -1) {
            eventmap[data.eventid].clients.push(ws);
        } else {
            eventmap[data.eventid].clients.splice(eventmap[data.eventid].clients.indexOf(ws), 1);
            eventmap[data.eventid].clients.push(ws);
        }
        //send the songs to the new client
        if (eventmap[data.eventid]) {
            sendSongs(data.eventid, [ws]);
        }
    } else {//add entry for event if event exists
        db.Event.findOne({'_id': data.eventid}, function (err, events) {
            if (err) {
                console.log('error: ' + err);
                return;
            }
            if (events === null) {
                return;
            }
            if (events.end !== null) {
                eventmap[data.eventid] = {
                    clients: []
                };
                eventmap[data.eventid].clients.push(ws);
            }
            //send the songs to the new client
            if (eventmap[data.eventid]) {
                sendSongs(data.eventid, [ws]);
            }
        });
    }
});

/**
 * get new Events if one is created
 *
 * @param id the id of the newly created event
 */
module.exports.addEvent = function (id) {
    eventmap[id] = {
        clients: []
    };
};

/**
 * remove Event entry if a event is closed
 *
 * @param id the id of the closed event
 */
module.exports.removeEvent = function (id) {
    if (eventmap[id]) {
        delete eventmap[id];
    }
};

/**
 * sends Songs to clients if a song update occurs
 *
 * @param id the Id of the event where the song update occured
 */
module.exports.newSong = function (id) {
    if (!eventmap[id]) {
        eventmap[id] = {
            clients: []
        };
    }
    if (eventmap[id]) {
        sendSongs(id, eventmap[id].clients);
    }
};