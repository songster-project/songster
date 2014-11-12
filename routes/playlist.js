var express = require('express');
var db = require('../config/database');
var expressValidator = require('express-validator');
var router = express.Router();
var util = require('util');

router.get('/', function (req, res) {
   res.send("Hello world");
});

router.post('/', function (req, res){
    req.checkBody('name', 'Name is empty').notEmpty();
    //TODO check for owner id ... this must be set somewhere
    var errors = req.validationErrors();
    if (errors) {
        res.send('There have been validation errors: ' + util.inspect(errors), 400);
        return;
    }

    var playlist = db.Playlist();
    playlist.name = req.body.name;
    playlist.song = req.body.song;
    playlist.owner_id = req.body.ownerid;

    playlist.save(function (err,playlist)
    {
        if(err) {
            console.log(err);
            res.status(400).send('Internal server error');
        }
        console.log(playlist);
        res.status(201).send(playlist);
    });


});

module.exports = router;