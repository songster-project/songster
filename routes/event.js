var express = require('express');
var passport = require('../config/passport');
var db = require('../config/database');
var expressValidator = require('express-validator');
var router = express.Router();
var util = require('util');
var Event = db.Event;
var songwebsocket = require('../backend/websockets/event_songs');
var urlshortener = require('../config/urlshortener');
var shortener = urlshortener.shortener;


//PS: avoids 304 in this module
//Problem occurs when i want to request the /past, and it doesn't change
router.get('/*', function(req, res, next){
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
});

//i put it here because we have no "general" stuff for utlitiy on the server
//also - the client controls how the event-link looks like (currently does ....)
//so therefor we need this shortener as a seperate route
//Note: in additional steps we could store this one here in the event and update it
//But not really crucial
router.get('/shorten',passport.ensureAuthenticated, passport.ensureNotAnonymous,function(req,res){
    req.checkQuery('q', 'no url to shorten defined in the q get parameter').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }
    shortener.shorten(req.query.q,function(err,resp){
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        if(resp.status_code == 500) {
            res.status(400).send("Error: "+resp.status_txt);
            return;
        }
        res.send({'url': resp.data.url});
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

router.get('/past', passport.ensureAuthenticated,function(req,res){
    db.Event.find({owner_id: req.user._id, end: {'$ne' : null}, deleted: {'$ne' : true}},null,{sort: {start: -1}}, function (err, events) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        if (events) {
            res.send(events);
            return;
        }
        res.send([]);
    });
});

router.get('/:id', passport.ensureAuthenticated, function (req, res) {
    req.checkParams('id', 'ID is not an ID').isMongoID();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }
    db.Event.findOne({_id: req.param('id'),  deleted: {'$ne' : true}}, function (err, event) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        if (event) {
            if(req.cookies.anonymous === 'true') {
                res.cookie('refererevent', event._id, {httpOnly: true});
            }
            res.status(200).send(event);
            return;
        }
        //event has not been updated, return error
        res.status(404).send();
    });
});

//i added the notactive to make it clear to the api that you can only delete notactive events
router.delete('/notactive/:id', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    req.checkParams('id', 'ID is not an ID').isMongoID();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }
    //I can only delete my events, and only not active ones (i.e. ended ones)
    db.Event.findOneAndUpdate({owner_id: req.user._id, _id: req.param('id'), end: {'$ne' : null}}, {$set: {deleted: true}}, function (err, event) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }

        if (event) {
            res.status(200).send();
            return;
        }
        //event has not existed => 204 no content
        res.status(204).send();
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
