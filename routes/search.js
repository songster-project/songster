var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var elasticSearchService = require('../backend/services/elasticSearchService');

router.get('/song', passport.ensureAuthenticated, function (req, res) {
    elasticSearchService.getClient().search({
        index: 'songster',
        type: 'song',
        body: {
            "query": {
                "filtered": {
                    "filter": {
                        "term": {
                            "owner_id": req.user._id
                        }
                    }
                }
            }
        }
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
        body: {
            "query": {
                "filtered": {
                    "query": {
                        "multi_match": {
                            "query": escapedQuery,
                            "fields": [
                                "title",
                                "artist",
                                "album",
                                "year"
                            ]
                        }
                    },
                    "filter": {
                        "term": {
                            "owner_id": req.user._id
                        }
                    }
                }
            }
        }
    }, function (error, response) {
        if (!error) {
            res.send(response);
        }
    });

});

module.exports = router;
