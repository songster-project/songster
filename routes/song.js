var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var database = require('../config/database');
var mongo = require('mongodb');
var ID3 = require('id3v1-parser');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

router.post('/', passport.ensureAuthenticated, function (req, res) {
    try {
        var form = new formidable.IncomingForm();
        form.uploadDir = 'upload';
        form.parse(req, function (err, fields, files) {

            var readStream = fs.createReadStream(files.filename.path);
            var writeStream = database.gfs.createWriteStream({
                mode: 'w',
                filename: files.file.name
            });

            writeStream.on('close', function () {
                try {
                    var readStream = database.gfs.createReadStream({
                        _id: writeStream.id
                    });
                    var metadata = {
                        addedDate: new Date()
                    };

                    var parser = readStream.pipe(new ID3());

                    parser.on('data', function (tag) {
                        metadata[tag.type] = tag.value;
                    });

                    parser.on('end', function () {
                        var collection = database.db.collection('songs');
                        metadata['file_id'] = writeStream.id;
                        collection.insert(metadata, function () {
                            console.log('saved metadata to mongo');
                            res.status(200).send('OK');
                        });
                    });

                } catch (err) {
                    console.log('error parsing id3 tags (maybe they are id3v2?)');
                }
            });
            readStream.pipe(writeStream);
        });
    } catch (e) {
        console.log(e);
        res.status(400).send('Internal server error');
    }
});

router.get('/:id', passport.ensureAuthenticated, function (req, res) {
    var songCollection = database.db.collection('songs');
    songCollection.findOne({"_id": mongo.ObjectID(req.param('id'))}, function (err, doc) {
        if (err) {
            res.status(400).send('Bad Request')
            throw err;
        } else {
            res.send(doc);
        }
    });
});

router.get('/:id/raw', passport.ensureAuthenticated, function (req, res) {
    var options = {
        _id: req.param("id")
    };

    if (database.gfs.exist(options, function (err, found) {
        if (err) {
            res.status(400).send('Internal server error');
        } else if (found) {
            var readStream = database.gfs.createReadStream(options);
            res.setHeader('Content-Type', 'audio/mp3'); // TODO add support for other audio formats
            readStream.pipe(res);
        } else {
            res.status(404).send('song not found');
        }
    }));
});

router.get('/', passport.ensureAuthenticated, function (req, res) {
    var songCollection = database.db.collection('songs');
    songCollection.find().toArray(function (err, docs) {
        if (err) {
            res.status(400).send('Internal server error');
            throw err;
        }
        res.send(docs);

    });
});


module.exports = router;
