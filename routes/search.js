var express = require('express');
var elasticsearch = require('elasticsearch');
var router = express.Router();
var passport = require('../config/passport');

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

var getSourceElementsFromResponse = function (response) {
    return response;
};

router.get('/song', passport.ensureAuthenticated, function (req, res) {
    client.search({
        index: 'songster',
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
        index: 'songster',
        type: 'song',
        q: '_all:' + req.params.query
    }, function (error, response) {
        if (!error) {
            res.send(getSourceElementsFromResponse(response));
        }
    });

});

module.exports = router;
