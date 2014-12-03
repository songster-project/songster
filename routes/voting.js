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
            console.log('in 1');
            res.status(500).send('Internal server error');
            return;
        }

        if(event == null) {
            res.send({});
            return;
        }

        // find all songs from the user with eventid
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



router.get('/:id', passport.redirectVoting);

module.exports = router;