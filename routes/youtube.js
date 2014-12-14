var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var database = require('../config/database');
var elasticSearchService = require('../backend/services/elasticSearchService');
var ytdl = require('ytdl-core');
var Ffmpeg = require('fluent-ffmpeg');
var util = require('util');


router.post('/', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    try {
        var streamfailed = false;
        req.checkBody('youtubeurl', 'URL is empty').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.status(400).send('There have been validation errors: ' + util.inspect(errors));
            return;
        }

        ytdl.getInfo(req.body.youtubeurl, function (err, info) {
            //if error occurs or youtube link is not valid send status 400
            if (err || info.title === undefined) {
                console.log(err);
                res.status(400).send('Bad request');
                return;
            }
            var title = info.title;
            //create stream to download from youtube (with 380p video quality)
            var ytdlstream = ytdl(req.body.youtubeurl, {quality: 18})
                //if error occurs during video downlaod send status 500
                .on('error', function (err) {
                if (!streamfailed) {
                    console.log(err);
                    streamfailed = true;
                    res.status(500).send('Internal Server Error');
                }
            });;
            //create stream to conver youtube video stream into mp3 stream
            var ffmpegstream = new Ffmpeg({source: ytdlstream})
                .withAudioCodec('libmp3lame')
                .toFormat('mp3')
                .duration('10:00')
                .on('error', function (err, stdout, stderr) {
                    if (!streamfailed) {
                        console.log(err);
                        streamfailed = true;
                        res.status(500).send('Internal Server Error');
                    }
                });
            //create stream to stream song into database
            var writeStream = database.gfs.createWriteStream({
                mode: 'w',
                filename: title + '.mp3'
            });

            //pipe mp3 stream into database
            ffmpegstream.pipe(writeStream);
            writeStream.on('close', function () {
                if (!streamfailed) {
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
        });
        //sometimes the error didn't get caught on the on error listeners
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;