var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var database = require('../config/database');
var elasticSearchService = require('../backend/services/elasticSearchService');
var ytdl = require('ytdl-core');
var Ffmpeg = require('fluent-ffmpeg');
var util = require('util');
var domain = require('domain');
var google = require('googleapis');
var youtubeapi = google.youtube('v3');
var authkey = require('../config/settings').authkey;
//song will be cut after this time (with format [[hh:]mm:]ss[.xxx])
var MAX_SONG_DURATION = '20:00';

router.get('/search', passport.ensureAuthenticated, function (req, res) {
    req.checkQuery('q', 'no search querry defined in the q get parameter').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        console.log( util.inspect(errors));
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }
    var query = req.query.q;
    // parameters for youtube search
    var params = {
        part: 'snippet',
        maxResults: req.query.numResults || 5,
        chart: 'mostPopular',
        q: query,
        type: 'video',
        auth: authkey
    };
    youtubeapi.search.list(params, function (err, result) {
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        var response = {
            result: []
        };
        //generate items for response
        result.items.forEach(function (entry) {
            var videoentry = {
                title: entry.snippet.title,
                channelTitle: entry.snippet.channelTitle,
                videoId: entry.id.videoId,
                thumbnailurl: entry.snippet.thumbnails.default
            };
            response.result.push(videoentry);
        });
        res.status(200).send(response);
    });
});

router.post('/', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {

    req.checkBody('youtubeurl', 'URL is empty').notEmpty();
    req.checkBody('youtubeurl', 'Parameter is no valid URL').isValidUrl();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }

    try {
        var d = domain.create();
        d.on('error', function (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
        d.run(function () {
            ytdl.getInfo(req.body.youtubeurl, function (err, info) {
                //if error occurs or youtube link is not valid send status 400
                if (err || info.title === undefined) {
                    console.log(err);
                    res.status(400).send('Bad request');
                    return;
                }
                var title = info.title;
                //create stream to download from youtube (with 380p video quality)
                var ytdlstream = ytdl(req.body.youtubeurl, {quality: 18});

                //create stream to conver youtube video stream into mp3 stream
                var ffmpegstream = new Ffmpeg({source: ytdlstream})
                    .withAudioCodec('libmp3lame')
                    .toFormat('mp3')
                    .duration(MAX_SONG_DURATION);

                //create stream to stream song into database
                var writeStream = database.gfs.createWriteStream({
                    mode: 'w',
                    filename: title + '.mp3'
                });

                //pipe mp3 stream into database
                ffmpegstream.pipe(writeStream);
                writeStream.on('close', function () {
                    var metadata = {
                        addedDate: new Date(),
                        title: title || '',
                        owner_id: req.user._id,
                        active: true
                    };

                    // the parser sometimes outputs utf-8 junk :-/
                    metadata.title = metadata.title.replace(/\0/g, '');

                    metadata.file_id = writeStream.id;
                    database.db.collection('song').insert(metadata, function (err, records) {
                        var record = records[0];
                        elasticSearchService.indexSong(record);
                        res.status(200).send('OK');
                    });
                });
            });
        });
        //sometimes the error didn't get caught on the on error listeners
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;