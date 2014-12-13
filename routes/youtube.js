var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var database = require('../config/database');
var elasticSearchService = require('../backend/services/elasticSearchService');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var util = require('util');


router.post('/', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    try {
        var streamfailed = false,title,errors,stream;
        req.checkBody('youtubeurl', 'URL is empty').notEmpty();
        errors = req.validationErrors();
        if (errors) {
            res.status(400).send('There have been validation errors: ' + util.inspect(errors));
            return;
        }

        ytdl.getInfo(req.body.youtubeurl, function (err, info) {
            if (err) {
                console.log(err);
                res.status(400).send('Bad request');
                return;
            }
            title = info.title;
            if (info.title === undefined) {
                res.status(400).send('Bad request');
                return;
            }

            var writeStream = database.gfs.createWriteStream({
                mode: 'w',
                filename: title + '.mp3'
            });

            stream = ytdl(req.body.youtubeurl, {quality: 18});

            stream.on('error',function(err){
                console.log(err);
                streamfailed = true;
                res.status(500).send('Internal Server Error');
            });
            writeStream.on('close', function () {
                if (!streamfailed){
                    var metadata = {
                        addedDate: new Date(),
                        title: title || '',
                        owner_id: req.user._id
                    };

                    // the parser sometimes outputs utf-8 junk :-/
                    metadata.title = metadata.title.replace(/\0/g, '');

                    metadata.file_id = writeStream.id;
                    database.db.collection('song').insert(metadata, function (err, records) {
                        var record = records[0];
                        elasticSearchService.indexSong(record);
                        res.status(200).send('OK');
                    });
                }
            });
            new ffmpeg({source: stream})
                .withAudioCodec('libmp3lame')
                .toFormat('mp3')
                .duration('10:00')
                .on('error', function (err, stdout, stderr) {
                    console.log(err);
                    streamfailed = true;
                    res.status(500).send('Internal Server Error');
                })
                .pipe(writeStream);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;