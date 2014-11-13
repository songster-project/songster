var express = require('express');
var passport = require('../config/passport');
var db = require('../config/database');
var expressValidator = require('express-validator');
var router = express.Router();
var util = require('util');

router.get('/', passport.ensureAuthenticated, function (req, res) {
    db.Playlist.find({owner_id: req.user._id}, function (err, playlists) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        res.send(playlists);
    });
});

router.get('/:id', passport.ensureAuthenticated, function (req, res) {
    db.Playlist.find({_id: req.param('id'), owner_id: req.user._id}, function (err, playlist) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        console.log(playlist);
        if (playlist.length > 0)
            res.send(playlist[0]);
        else
            res.send({}); //Not sure yet if this is usefull or intended behaviour
    });
});

router.delete('/:id', passport.ensureAuthenticated, function (req, res) {
    req.checkParams('id', '_id of playlist not specified').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }

    db.Playlist.remove({_id: req.param('id'), owner_id: req.user._id}, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        res.status(204).send();
    });
});

router.put('/', passport.ensureAuthenticated, function (req, res) {
    req.checkBody('_id', '_id of playlist not specified').notEmpty();
    req.checkBody('owner_id', 'id of owner not set').notEmpty();
    req.checkBody('owner_id', 'id of owner is not of the logged in one').equals(req.user._id);
    req.checkBody('name', 'Name is empty').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }
    var id = req.body._id;
    delete req.body._id;
    //ID + owner because i can only update my playlists
    //Without ownerid, i could change the playlist of someone elses to mine
    //PlaylistID => form another user, Owner_ID => Mine, thus i steal it
    db.Playlist.findOneAndUpdate({_id: id,owner_id: req.user._id}, req.body, function (err, playlist) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
        if (playlist)
            res.status(200).send(playlist);
        //Playlist has not been updated, return error
        res.status(404).send();

        return;
    });


});

router.post('/', passport.ensureAuthenticated, function (req, res) {
    //Maybe this does not need to be (because it is done by passport, and passport should authenticate
    req.checkBody('name', 'Name is empty').notEmpty();
    req.checkBody('owner_id', 'id of owner not set').notEmpty();
    req.checkBody('owner_id', 'id of owner is not of the logged in one').equals(req.user._id);
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }

    var playlist = db.Playlist();
    playlist.name = req.body.name;
    playlist.song = req.body.song;
    playlist.owner_id = req.user._id;

    playlist.save(function (err, playlist) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
        }
        console.log(playlist);
        res.status(201).send(playlist);
    });


});

module.exports = router;