var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var database = require('../config/database');
var mongo = require('mongodb');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var id3 = require('../misc/id3');
var albumArt = require('album-art');
var request = require('request');
var GridStore = require('mongodb').GridStore;
var ObjectID = require('mongodb').ObjectID;

router.post('/', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    try {
        var form = new formidable.IncomingForm();
        form.uploadDir = 'upload';
        form.parse(req, function (err, fields, files) {
            if (files.file != null) {
                var readStream = fs.createReadStream(files.file.path);
                var writeStream = database.gfs.createWriteStream({
                    mode: 'w',
                    filename: files.file.name
                });
                readStream.pipe(writeStream);

                console.log('Started writing to GFS');
                writeStream.on('close', function () {

                    id3({file: files.file.path, type: id3.OPEN_LOCAL}, function (err, tags) {
                        if (err) {
                            console.log(err);
                            res.status(400).send('Bad request');
                            return;
                        }

                        var metadata = {
                            addedDate: new Date(),
                            title: tags.title || '',
                            album: tags.album || '',
                            artist: tags.artist || '',
                            year: tags.year || ''
                        };

                        // the parser sometimes outputs utf-8 junk :-/
                        metadata.title = metadata.title.replace(/\0/g, '');
                        metadata.album = metadata.album.replace(/\0/g, '');
                        metadata.artist = metadata.artist.replace(/\0/g, '');
                        metadata.year = metadata.year.replace(/\0/g, '');

                        // return before getting the cover from lastfm - no need to delay
                        res.status(200).send('OK');

                        var saveMetadata = function () {
                            var collection = database.db.collection('song');
                            metadata['file_id'] = writeStream.id;
                            collection.insert(metadata, function () {
                                console.log('saved metadata to mongo');
                                fs.unlink(files.file.path, function (err) {
                                    if (err) {
                                        console.log('error deleting the temp-file');
                                        console.log(err);
                                    }
                                });
                            });
                        };

                        albumArt(metadata.artist, metadata.album, 'large', function (err, url) {
                            console.log('metadata url: ' + url);

                            if (!err && url != null && url.length > 0) {
                                var imageWriteStream = database.gfs.createWriteStream({
                                    mode: 'w'
                                });

                                request.head(url, function () {
                                    request(url).pipe(imageWriteStream).on('close', function () {
                                        console.log('wrote album art to mongodb');
                                        metadata.cover = imageWriteStream.id;
                                        saveMetadata();
                                    });
                                });
                            } else {
                                saveMetadata();
                            }
                        });
                    });
                });

            } else {
                res.status(400).send('Bad request');
                return;
            }

        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal server error');
        return;
    }
});

router.get('/:id', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    var songCollection = database.db.collection('song');
    songCollection.findOne({"_id": mongo.ObjectID(req.param('id'))}, function (err, doc) {
        if (err) {
            res.status(400).send('Bad Request');
            console.log(err);
            return;
        } else {
            res.send(doc);
        }
    });
});

router.get('/:id/raw', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    var options = {
        _id: req.param("id")
    };

    database.gfs.exist(options, function (err, found) {
        if (err || !found) {
            res.status(404).send('song not found');
            return;
        }

        if (found) {
            new GridStore(database.db, new ObjectID(options._id), null, 'r').open(function (err, GridFile) {
                if (req.headers['range']) {
                    console.log('got a range request - because fck you');

                    var parts = req.headers['range'].replace(/bytes=/, "").split("-");
                    var partialstart = parts[0];
                    var partialend = parts[1];

                    var start = parseInt(partialstart, 10);
                    var end = partialend ? parseInt(partialend, 10) : GridFile.length - 1;
                    var chunk = (end - start) + 1;

                    console.log('Range ', start, '-', end);

                    res.writeHead(206, {
                        'Content-Range': 'bytes ' + start + '-' + end + '/' + GridFile.length,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunk,
                        'Content-Type': 'audio/mp3'
                    });

                    var options = {
                        _id: req.param("id"),
                        range: {
                            startPos: start,
                            endPos: end
                        }
                    };

                    var readStream = database.gfs.createReadStream(options);
                    readStream.pipe(res);

                } else {
                    console.log('got a normal request - streaming the whole file');
                    var readStream = database.gfs.createReadStream({
                        _id: req.param("id")
                    });
                    res.setHeader('Content-Type', 'audio/mp3');
                    readStream.pipe(res);
                }
            });
        }
    });
});

router.get('/:id/cover', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    var options = {
        _id: req.param('id')
    };

    if (database.gfs.exist(options, function (err, found) {
            if (err) {
                res.status(500).send('Internal server error');
                console.log(err);
                return;
            } else if (found) {
                var readStream = database.gfs.createReadStream(options);
                res.setHeader('Content-Type', 'image/jpeg');
                readStream.pipe(res);
            } else {
                res.status(404).send('cover not found');
                return;
            }
        }));
});

router.get('/', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    var songCollection = database.db.collection('song');
    songCollection.find().toArray(function (err, docs) {
        if (err) {
            res.status(500).send('Internal server error');
            console.log(err);
            return;
        }
        res.send(docs);

    });
});

module.exports = router;
