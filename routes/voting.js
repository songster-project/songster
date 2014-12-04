var express = require('express');
var passport = require('../config/passport');
var db = require('../config/database');
var expressValidator = require('express-validator');
var router = express.Router();
var util = require('util');
var Event = db.Event;
var Song = db.Song;


router.get('/songs/:eventid', passport.ensureAuthenticated, function (req, res) {

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

        // find all songs from the user with eventid
        // TODO join votes and send votes per song with song
       db.Song.find({owner_id: event.owner_id}, ' title artist album year')
           .select('title artist album year')
           .limit(30)
           .exec(function (err, songs){
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
});

router.post('/:event_id', passport.ensureAuthenticated, function(req, res) {

    console.log('in voting post');

    // for anonym user it must equal the session for only one vote per song
    req.assert('owner_id', 'Owner_id is not the same as users password').equals(req.user._id);
    req.assert('type', 'Type does not match vote types').isInArray(('vote suggestion').split(' '));
    req.assert('state', 'State does not match any state type').isInArray(('new played').split(' '));
    req.checkBody('song_id', 'Song ID must not be empty').notEmpty();
    req.checkBody('event_id', 'Event ID must not be empty').notEmpty();

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
        db.Song.findOne({_id: req.param('song_id'), active:true}, function(err, song){
            if(err) {
                console.log(err);
                res.status(500).send('Internal server error');
                return;
            }

            if (song == null) {
                console.log('event is not active');
                res.status(400).send('Bad Request');
                return;
            }

            // TODO: implementing vote on song from one user is only once allowed - verify on session id or something like this
            var vote = db.Vote();
            vote.owner_id = req.body.owner_id;
            vote.type = req.body.type;
            vote.state = req.body.state;
            vote.song_id = req.body.song_id;
            vote.event_id = req.body.event_id;

            vote.save( function(err, vote){
               if(err)  {
                   console.log(err);
                   res.status(500).send('Internal server error');
                   return;
               }

                res.status(201).send(vote);

            });

        });


    });






});

router.get('/:id', passport.redirectVoting);

module.exports = router;