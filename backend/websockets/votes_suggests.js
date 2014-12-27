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
            sendVotes(data.eventid, [ws]);
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
                sendVotes(data.eventid, [ws]);
            }
        });
    }
});

function sendVotes(eventId, clients) {

    db.Event.findOne({_id: eventId, end:null}, function (err, event) {
        if (err) {
            console.log(err);
            //res.status(500).send('Internal server error');
            return;
        }

        if(event == null) {
            console.log('event not found');
            //res.status(400).send('Bad Request');
            return;
        }

        // find all voted songs from event and send them back
        var o = {};
        o.map = function() {
            emit( this.song_id, 1);
        };
        o.reduce = function(key, values) {
            return values.length;
        };
        o.out = {
            replace: 'songsWithVotes'
        };
        o.query = {
            event_id: event._id,
            state: 'new',
            type: 'vote'
        };

        db.Vote.mapReduce(o, function (err, model) {
                model
                    .find()
                    .populate({path: '_id', model: 'Song', select: '_id title artist album year'})
                    .exec( function(err, votes){
                        if(err) {
                            console.log(err);
                            //res.status(500).send('Internal server error');
                            return;
                        }

                        console.log('ws votes_changed send_notification');
                        nserver.send_Notifications('votes_changed', votes, clients);
                    });

            }
        );
    });



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
module.exports.votesChanged = function (id) {
    if (!eventmap[id]) {
        eventmap[id] = {
            clients: []
        };
    }
    if (eventmap[id]) {
        sendVotes(id, eventmap[id].clients);
    }
};
