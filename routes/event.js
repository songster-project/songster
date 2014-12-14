var express = require('express');
var passport = require('../config/passport');
var db = require('../config/database');
var expressValidator = require('express-validator');
var router = express.Router();
var util = require('util');
var Event = db.Event;
var songwebsocket = require('../backend/websockets/event_songs');

router.get('/', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    db.Event.find({owner_id: req.user._id}, function (err, playlists) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        res.send(playlists);
    });
});

router.get('/active', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    db.Event.find({end: null}, function (err, events) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        res.send(events);
    });
});

router.get('/current', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    db.Event.findOne({owner_id: req.user._id, end: null}, function (err, event) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        if (event) {
            res.send(event);
            return;
        }
        res.send({});
    });
});


router.get('/:id', passport.ensureAuthenticated, function (req, res) {
    req.checkParams('id', 'ID is not an ID').isMongoID();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }
    db.Event.findOne({_id: req.param('id')}, function (err, event) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        if (event) {
            res.status(200).send(event);
            return;
        }
        //event has not been updated, return error
        res.status(404).send();
    });
});


//For when you want to end the current event
router.put('/current/end', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    db.Event.findOneAndUpdate({owner_id: req.user._id, end: null}, {$set: {end: Date.now()}}, function (err, event) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        if (event) {
            songwebsocket.removeEvent(event._id);
            res.status(200).send(event);
            return;
        }
        //event has not been updated, return error
        res.status(404).send();
    });
});

router.post('/', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    //Maybe this does not need to be (because it is done by passport, and passport should authenticate
    req.checkBody('name', 'Name is empty').notEmpty();
    req.checkBody('owner_id', 'id of owner not set').notEmpty();
    req.checkBody('owner_id', 'id of owner is not of the logged in one').equals(req.user._id);
    //description => may be null
    //start date will be set
    //end date will be set
    req.checkBody('suggestionEnabled', 'suggestionsenabled needs to be set and needs to be true or false').notEmpty().isBool();
    req.checkBody('votingEnabled', 'votingenabled needs to be set and needs to be true or false').notEmpty().isBool();
    req.checkBody('previewEnabled', 'previewenabled needs to be set and needs to be true or false').notEmpty().isBool();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }

    db.Event.findOne({owner_id: req.body.owner_id, end: null}, function (err, eventDB) {

        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        if (eventDB) {
            console.log('Event already running: ' + eventDB);
            res.status(400).send('This user has already an event running');
            return;
        }
        var event = db.Event();
        event.name = req.body.name;
        event.owner_id = req.body.owner_id;
        event.description = req.body.description;
        event.accessKey = req.body.accessKey;
        event.votingEnabled = req.body.votingEnabled;
        event.previewEnabled = req.body.previewEnabled;
        event.suggestionEnabled = req.body.suggestionEnabled;
        //Note: i know it MIGHT be the case that between the check and the execution, anotherone is added
        //I currently have not really a solution for this, the probability for this is extr emely low
        //If this is really an important test case ... check afterwards if only one exists
        event.save(function (err, event) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal server error');
                return;
            }
            songwebsocket.addEvent(event._id);
            res.status(201).send(event);
        });

    });
});


module.exports = router;
