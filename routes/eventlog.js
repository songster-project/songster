var express = require('express');
var passport = require('../config/passport');
var db = require('../config/database');
var router = express.Router();
var util = require('util');
var songwebsocket = require('../websockets/event_songs');

//Posts an eventlog entry to event defined by :id
//the event must be active and only i, the owner of the event, can post this
router.post('/:id', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    req.checkBody('message', 'message not specified').notEmpty();
    req.checkBody('type', 'type not specified').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }
    //Check that the event is active
    //Check that i am the owner of the event
    //Post the event
    db.Event.findOne({_id: req.param('id')}, function (err, event) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        if (event.owner_id !== req.user.id) {
            res.status(403).send('Not allowed because you are not the owner of the event');
        }
        var evLog = new db.EventLog();
        if (!event.previewEnabled) {
            if (req.body.message.nextSongs) {
                delete req.body.message.nextSongs;
            }
        }
        evLog.event_id = event.id;
        //Date is set by mongoose
        evLog.message = JSON.stringify(req.body.message);
        evLog.type = req.body.type;
        evLog.save(function (err, eventlog) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal server error');
                return;
            }
            if (eventlog.type === 'songplayed') {
                songwebsocket.newSong(eventlog.event_id);
            }
            res.status(201).send(eventlog);
        });
    });
});

module.exports = router;