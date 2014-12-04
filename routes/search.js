var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var elasticSearchService = require('../backend/services/elasticSearchService');

router.get('/song', passport.ensureAuthenticated, function (req, res) {
    elasticSearchService.getClient().search({
        index: 'songster',
        type: 'song'
    }, function (error, response) {
        if (!error) {
            res.send(response);
        }
    });

});

router.get('/song/:query', passport.ensureAuthenticated, function (req, res) {
    var escapedQuery = elasticSearchService.escape(req.params.query);
    elasticSearchService.getClient().search({
        index: 'songster',
        type: 'song',
        q: '_all:' + escapedQuery
    }, function (error, response) {
        if (!error) {
            res.send(response);
        }
    });

});

module.exports = router;
