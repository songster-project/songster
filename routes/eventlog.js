var express = require('express');
var passport = require('../config/passport');
var db = require('../config/database');
var router = express.Router();
var util = require('util');
var songwebsocket = require('../backend/websockets/event_songs');

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
        if (event.owner_id != req.user.id) {
            res.status(403).send('Not allowed because you are not the owner of the event');
            return;
        }
        var evLog = new db.EventLog();
        if (!event.previewEnabled) {
            if (req.body.message.nextSongs) {
                delete req.body.message.nextSongs;
            }
        }
        evLog.event_id = event.id;
        //Date is set by mongoose
        evLog.message = req.body.message;
        evLog.type = req.body.type;
        evLog.save(function (err, eventlog) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal server error');
                return;
            }
            if (eventlog.type === 'songplayed') {
                songwebsocket.newSong(eventlog.event_id);
                //TODO Lisa: this is the method where we have to update our votes that they have been played
                //Just go over the whole collection checking for eventid matches and that the song matches
            }
            res.status(201).send(eventlog);
        });
    });
});

//Returns the songs of the given event
router.get('/songs/:id', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    req.checkParams('id', 'ID is not an ID').isMongoID();
    req.checkParams('id', '_id of event not specified').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }
    db.EventLog.find(
        {
            type: "songplayed",
            event_id: req.param('id')
        },
        {
            _id: 0,
            logDate: 1,
            'message.currentSong.title': 1,
            'message.currentSong.artist': 1,
            'message.currentSong.album': 1
        },
        //1 because when you imagine a playlist, the past songs are higher up
        {sort: {logDate: 1}},
            function (err, songs) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal server error');
            }
            res.send(songs);
            return;
        });
});
module.exports = router;