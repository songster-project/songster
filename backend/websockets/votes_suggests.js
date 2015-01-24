var nserver = require('../services/notification_server');
var db = require('../../config/database');
var votes_eventmap = {};
var suggestion_eventmap = {}

/*
 * get registrations for votes_changed event
 */
nserver.register_to_UserRegistrations('votes_changed', function (ws, req, data) {
    ws.on('close', function () {
        if (votes_eventmap[data.eventid]) {
            if (votes_eventmap[data.eventid].clients.indexOf(ws) >= 0) {
                votes_eventmap[data.eventid].clients.splice(votes_eventmap[data.eventid].clients.indexOf(ws), 1);
            }
        }
    });
    if (votes_eventmap[data.eventid]) {
        //check if client is already registered
        if (votes_eventmap[data.eventid].clients.indexOf(ws) === -1) {
            votes_eventmap[data.eventid].clients.push(ws);
        } else {
            votes_eventmap[data.eventid].clients.splice(votes_eventmap[data.eventid].clients.indexOf(ws), 1);
            votes_eventmap[data.eventid].clients.push(ws);
        }
        //send the songs to the new client
        /*if (votes_eventmap[data.eventid]) {
            sendVotes('votes_changed', undefined, [ws]);
        }*/
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
                votes_eventmap[data.eventid] = {
                    clients: []
                };
                votes_eventmap[data.eventid].clients.push(ws);
            }
            //send the songs to the new client
            /*if (votes_eventmap[data.eventid]) {
                sendVotes('votes_changed', undefined, [ws]);
            }*/
        });
    }
});

/*
 * get registrations for votes_changed event
 */
nserver.register_to_UserRegistrations('suggestion_played', function (ws, req, data) {
    ws.on('close', function () {
        if (suggestion_eventmap[data.eventid]) {
            if (suggestion_eventmap[data.eventid].clients.indexOf(ws) >= 0) {
                suggestion_eventmap[data.eventid].clients.splice(suggestion_eventmap[data.eventid].clients.indexOf(ws), 1);
            }
        }
    });
    if (suggestion_eventmap[data.eventid]) {
        //check if client is already registered
        if (suggestion_eventmap[data.eventid].clients.indexOf(ws) === -1) {
            suggestion_eventmap[data.eventid].clients.push(ws);
        } else {
            suggestion_eventmap[data.eventid].clients.splice(suggestion_eventmap[data.eventid].clients.indexOf(ws), 1);
            suggestion_eventmap[data.eventid].clients.push(ws);
        }
        //send the songs to the new client
        /*if (suggestion_eventmap[data.eventid]) {
            sendVotes('votes_changed', undefined, [ws]);
        }*/
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
                suggestion_eventmap[data.eventid] = {
                    clients: []
                };
                suggestion_eventmap[data.eventid].clients.push(ws);
            }
            //send the songs to the new client
            /*if (suggestion_eventmap[data.eventid]) {
                sendVotes('votes_changed', undefined, [ws]);
            }*/
        });
    }
});

function sendVotes(event_name, vote, clients) {

    if(vote) {
        nserver.send_Notifications(event_name, vote, clients);
    }
}

/**
 * get new Events if one is created
 *
 * @param id the id of the newly created event
 *//*
module.exports.addEvent = function (id) {
    votes_eventmap[id] = {
        clients: []
    };
};*/

/**
 * remove Event entry if a event is closed
 *
 * @param id the id of the closed event
 *//*
module.exports.removeEvent = function (id) {
    if (votes_eventmap[id]) {
        delete votes_eventmap[id];
    }
};*/

/**
 * sends vote to clients if a vote is updated
 *
 * @param id the Id of the event where the song update occured
 */
module.exports.votesChanged = function (event_id, vote) {
    if (!votes_eventmap[event_id]) {
        votes_eventmap[event_id] = {
            clients: []
        };
    }
    if (votes_eventmap[event_id]) {
        sendVotes('votes_changed', vote, votes_eventmap[event_id].clients);
    }
};

/**
 * sends suggestion to clients if suggestion is played
 *
 * @param id the Id of the event where the suggest update occured
 * @param suggestion the suggestion that was updated
 */
module.exports.suggestionPlayed = function (event_id, suggestion) {
    if (!suggestion_eventmap[event_id]) {
        suggestion_eventmap[event_id] = {
            clients: []
        };
    }
    if (suggestion_eventmap[event_id]) {
        sendVotes('suggestion_played', suggestion, suggestion_eventmap[event_id].clients);
    }
};
