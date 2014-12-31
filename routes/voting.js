var express = require('express');
var passport = require('../config/passport');
var db = require('../config/database');
var expressValidator = require('express-validator');
var router = express.Router();
var util = require('util');
var Event = db.Event;
var Song = db.Song;
var mongoose = require('mongoose');
var mongo = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var votesWs = require('../backend/websockets/votes_suggests');


/*router.get('/randomsongs/:eventid', passport.ensureAuthenticated, function (req, res) {

 // get current event with eventid
 db.Event.findOne({_id: req.param('eventid'), end:null}, function (err, event) {
 if (err ) {
 console.log(err);
 res.status(500).send('Internal server error');
 return;
 }

 if(event == null) {
 res.send({});
 return;
 }

 // find 10 random songs for voting
 db.Song.findRandom().select('title artist album year').limit(10).exec(function (err, songs){
 if (err) {
 console.log(err);
 res.status(500).send('Internal server error');
 return;
 }

 if(songs) {
 res.send(songs);
 return;
 }

 res.send({});
 });
 });
 }); */


/**
 * returns and array of all votes from the event with given event_id that have not been played yet
 * [{ song_id: { title: 'xxxx', album: 'xxxx', artist: 'xxx', year: '2000', _id: xx },
 *   state: 'new'
  *  type: 'vote',
  *  _id: xxxx,
  *  date: xxx },
 *  { song_id: .... },
 *  { song_id: ....} ]
 *
 *  is called for initial load of vote-view page
 */
router.get('/votedsongs/:eventid', passport.ensureAuthenticated, function(req, res){

    req.checkParams('eventid', 'Event ID must not be empty').notEmpty();
    req.checkParams('eventid', 'event_id is not an ID').isMongoID();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }

    // get current event with eventid
    db.Event.findOne({_id: req.param('eventid'), end:null}, function (err, event) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }

        if(event == null) {
            console.log('event not found');
            res.status(400).send('Bad Request');
            return;
        }

        db.Vote.find( {event_id: event._id, type: 'vote', state: {$ne: 'played'}})
            .select( 'date state type song_id')
            .populate( {path: 'song_id', model: 'Song', select: '_id title artist album year'})
            .exec( function(err, votes){
                if(err) {
                    console.log(err);
                    res.status(500).send('Internal server error');
                    return;
                }
                res.status(200).send(votes);
            });
    });
});


/**
 * returns an array of votes concerning only song information
 * from the current user from the event with given event_id that have not been played yet
 * [{ song_id: {
 *      _id: ,
 *      title: ,
 *      artist: ,
 *      album: ,
 *      year:
 * } },
 *  { song_id: {} } ]
 *
 * used for disabling multiple votes from a user
 * the client aggregates those song_ids
 */
router.get('/uservotes/:eventid', passport.ensureAuthenticated, function(req, res){

    req.checkParams('eventid', 'Event ID must not be empty').notEmpty();
    req.checkParams('eventid', 'event_id is not an ID').isMongoID();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }

    // get current event with eventid
    db.Event.findOne({_id: req.param('eventid'), end:null}, function (err, event) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }

        if(event == null) {
            console.log('event not found');
            res.status(400).send('Bad Request');
            return;
        }

        db.Vote.find({event_id: event._id, owner_id: req.user.id, state: 'new', type: 'vote'})
            .populate({path: 'song_id', model: 'Song', select: '_id title artist album year'})
            .select( 'song_id -_id')
            .exec( function(err, votes) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal server error');
                    return;
                }
                res.status(200).send(votes);
                return;
            });

    });
});


router.post('/:event_id', passport.ensureAuthenticated, function(req, res) {

    req.assert('type', 'Type does not match vote types').isInArray(('vote suggestion').split(' '));
    req.assert('state', 'State does not match any state type').isInArray(('new played').split(' '));
    req.checkBody('song_id', 'Song ID must not be empty').notEmpty();
    req.checkParams('event_id', 'Event ID must not be empty').notEmpty();
    req.checkBody('song_id', 'Song_id is not an ID').isMongoID();
    req.checkParams('event_id', 'event_id is not an ID').isMongoID();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }

    // check that event id is active
    db.Event.findOne({_id: req.param('event_id'), end:null }, function (err, event){
        if(err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }

        if (event == null) {
            console.log('event is not active');
            res.status(400).send('Bad Request');
            return;
        }


        // check that song is in db
        //db.Song.findOne({"_id": mongo.ObjectID(req.param('song_id'))}, function(err, song){
        db.Song.findOne({_id: req.param('song_id'), active:true}, function(err, song){
            if(err) {
                console.log(err);
                res.status(500).send('Internal server error');
                return;
            }

            if (song == null) {
                console.log('song is not active');
                res.status(400).send('Bad Request');
                return;
            }

            // search for votes on song and event from current user
            db.Vote.find({event_id: event._id, owner_id: req.user.id, song_id: song._id, state: 'new', type: 'vote'}, function(err, votes) {
                if(err) {
                    console.log(err);
                    res.status(500).send('Internal server error');
                    return;
                }

                if(votes[0] != null) {
                    console.log('vote for song already exists');
                    res.status(400).send('Bad Request');
                    return;
                }

                var vote = db.Vote();
                vote.owner_id = req.user.id;
                vote.type = req.body.type;
                vote.state = req.body.state;
                vote.song_id = req.body.song_id;
                vote.event_id = req.param('event_id');

                vote.save( function(err, vote){
                    if(err)  {
                        console.log(err);
                        res.status(500).send('Internal server error');
                        return;
                    }
                    res.status(201).send(vote);

                    // notify web socket vote_changed event

                    db.Vote.findOne( {_id: vote._id})
                        .select( 'date state type song_id')
                        .populate( {path: 'song_id', model: 'Song', select: '_id title artist album year'})
                        .exec( function(err, vote_pop){
                            if(err) {
                                console.log(err);
                            }
                            votesWs.votesChanged(event._id, vote_pop);
                        });


                    db.Song.find({_id: vote.song_id}, function (err, song) {
                        // save the vote to the event log
                        if (song && song.length > 0) {

                            var evLog = new db.EventLog();

                            evLog.event_id = event._id;
                            evLog.message = {
                                date: new Date(),
                                vote: vote,
                                song: song[0]
                            };
                            evLog.type = 'songvoted';

                            evLog.save(function (err, eventlog) {
                                if (err) {
                                    console.log('error saving event log for the new vote');
                                    console.log(err);
                                } else {
                                    console.log('Successfully saved event log for vote');
                                }
                            });
                        }
                    });
                });
            });
        });
    });

});

router.get('/:id', passport.redirectVoting);


module.exports = router;