var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var db = require('../config/database');
var mongo = require('mongodb');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var id3 = require('../misc/id3');
var albumArt = require('album-art');
var request = require('request');
var GridStore = require('mongodb').GridStore;
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var elasticSearchService = require('../backend/services/elasticSearchService');

router.get('/:id', passport.ensureAuthenticated, passport.ensureNotAnonymous, function(req, res, next) {
    // get event of current user - user is DJ
    db.Event.findOne( { owner_id: req.user.id, end:null}, function(err, event) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }

        // get song of id parameter
        if(event) {
            db.Song.findOne( {_id: req.param('id'), active: true}, function(err, song) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal server error');
                    return;
                }

                // check if song owner has suggested this song at the event
                // if song was suggested once it can be accessed by the dj several times at the same event
                if(song) {
                    var song_owner = song.owner_id;
                    db.Vote.findOne({event_id: event._id, owner_id: song.owner_id, song_id: song._id, type:'suggestion'})
                        .exec( function(err, suggest) {
                            if (err) {
                                console.log(err);
                                res.status(500).send('Internal server error');
                                return;
                            }

                            if(suggest) {
                                // set req.user.id to song.owner_id to allow playing suggested song
                                console.log('set user.id');
                                req.user._id = song.owner_id;
                                console.log(req.user);
                            }
                            next();
                        });
                } else {
                    next();
                }
            })
        } else {
            next();
        }
    });
});

router.get('/:id/raw', passport.ensureAuthenticated, passport.ensureNotAnonymous, function(req, res, next) {
    // get event of current user - user is DJ
    db.Event.findOne( { owner_id: req.user.id, end:null}, function(err, event) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }

        // get song of file_id parameter
        if(event) {
            db.Song.findOne( { file_id: req.param('id'), active: true}, function(err, song) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal server error');
                    return;
                }

                // check if song owner has suggested this song at the event
                // if song was suggested once it can be accessed by the dj several times at the same event
                if(song) {
                    var song_owner = song.owner_id;
                    db.Vote.findOne({event_id: event._id, owner_id: song.owner_id, song_id: song._id, type:'suggestion'})
                        .exec( function(err, suggest) {
                            if (err) {
                                console.log(err);
                                res.status(500).send('Internal server error');
                                return;
                            }

                            if(suggest) {
                                // set req.user.id to song.owner_id to allow playing suggested song
                                req.user._id = song.owner_id;
                            }
                            next();
                        });
                } else {
                    next();
                }
            })
        } else {
            next();
        }

    });
});



module.exports = router;