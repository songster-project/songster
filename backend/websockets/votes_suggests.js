var nserver = require('../services/notification_server');
var db = require('../../config/database');
var eventmap = {};



/*
 * get registrations for votes_changed event
 */
nserver.register_to_UserRegistrations('votes_changed', function (ws, req, data) {
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
            sendVotes(undefined, [ws]);
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
            if (events.end === null) {
                eventmap[data.eventid] = {
                    clients: []
                };
                eventmap[data.eventid].clients.push(ws);
            }
            //send the songs to the new client
            if (eventmap[data.eventid]) {
                sendVotes(undefined, [ws]);
            }
        });
    }
});

function sendVotes(vote, clients) {

    if(vote) {
        nserver.send_Notifications('votes_changed', vote, clients);
    }
}

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
module.exports.votesChanged = function (event_id, vote) {
    if (!eventmap[event_id]) {
        eventmap[event_id] = {
            clients: []
        };
    }
    if (eventmap[event_id]) {
        sendVotes(vote, eventmap[event_id].clients);
    }
};
