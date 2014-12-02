var express = require('express');
var elasticsearch = require('elasticsearch');
var router = express.Router();
var passport = require('../config/passport');

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

var index = 'songster';
var publicFields = ['title', 'artist', 'album'];

var getSourceElementsFromResponse = function (response) {
    return response;
};

//router.get('/', passport.ensureAuthenticated, function (req, res) {
//    client.search({
//        index: 'users',
//        size: 50,
//        body: {
//            query: {
//                match: {
//                    profile: 'elasticsearch'
//                }
//            }
//        }
//    }).then(function (resp) {
//        var hits = resp.body.hits;
//    });
//    res.send('This is the search!');
//});

router.get('/song', passport.ensureAuthenticated, function (req, res) {
    client.search({
        index: index,
        type: 'song',
        pretty: true
    }, function (error, response) {
        if (!error) {
            res.send(getSourceElementsFromResponse(response));
        }
    });

});

router.get('/song/:query', passport.ensureAuthenticated, function (req, res) {
    client.search({
        index: index,
        type: 'song',
        q: '_all:' + req.params.query
    }, function (error, response) {
        if (!error) {
            res.send(getSourceElementsFromResponse(response));
        }
    });

});

//router.get('/song/album/:name', passport.ensureAuthenticated, function (req, res) {
//    client.search({
//        index: 'songs',
//        q: 'album:' + req.params.name
//    }, function (error, response) {
//        if (!error) {
//            res.send(getSourceElementsFromResponse(response));
//        }
//    });
//});
//
//router.get('/song/artist/:name', passport.ensureAuthenticated, function (req, res) {
//    client.search({
//        index: 'songs',
//        q: 'artist:' + req.params.name
//    }, function (error, response) {
//        if (!error) {
//            res.send(getSourceElementsFromResponse(response));
//        }
//    });
//});
//
//router.get('/song/year/:name', passport.ensureAuthenticated, function (req, res) {
//    client.search({
//        index: 'songs',
//        q: 'year:' + req.params.name
//    }, function (error, response) {
//        if (!error) {
//            res.send(getSourceElementsFromResponse(response));
//        }
//    });
//});

module.exports = router;
