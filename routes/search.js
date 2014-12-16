var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var elasticSearchService = require('../backend/services/elasticSearchService');
var db = require('../config/database');

var searchableFields = [
    "title",
    "artist",
    "album",
    "year"
];

router.get('/song', passport.ensureAuthenticated, function (req, res) {
    var query = req.query.q;
    var body = undefined;
    if (query === undefined) {
        // all query
        body = {
            "query": {
                "filtered": {
                    "filter": {
                        "term": {
                            "owner_id": req.user._id
                        }
                    }
                }
            }
        };
    } else {
        // specific song search
        var escapedQuery = elasticSearchService.escape(query);
        var parsedQuery = elasticSearchService.parseQuery(escapedQuery);
        body = {
            "query": {
                "filtered": {
                    "query": {
                        "multi_match": {
                            "query": parsedQuery,
                            "type": 'cross_fields',
                            "operator": 'and',
                            "fields": searchableFields
                        }
                    },
                    "filter": {
                        "term": {
                            "owner_id": req.user._id
                        }
                    }
                }
            }
        };
    }

    elasticSearchService.getClient().search({
        index: 'songster',
        type: 'song',
        body: body
    }, function (error, response) {
        if (!error) {
            res.send(response);
        } else {
            console.log("Elastic Search Error");
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    });
});

router.get('/eventsongs/:eventid', passport.ensureAuthenticated, function (req, res) {
    var query = req.query.q;
    // get active event with eventid from req.param
    db.Event.findOne({_id: req.param('eventid'), end:null}, function (err, event) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }

        if (event == null) {
            console.log('event not found');
            res.status(400).send('Bad Request');
            return;
        }

        var escapedQuery = elasticSearchService.escape(query);
        var parsedQuery = elasticSearchService.parseQuery(escapedQuery);
        elasticSearchService.getClient().search({
            index: 'songster',
            type: 'song',
            body: {
                "query": {
                    "filtered": {
                        "query": {
                            "multi_match": {
                                "query": parsedQuery,
                                "fields": searchableFields
                            }
                        },
                        "filter": {
                            "term": {
                                "owner_id": event.owner_id
                            }
                        }
                    }
                }
            }
        }, function (error, response) {
            if (!error) {
                res.send(response);
            } else {
                console.log("Elastic Search Error");
                console.log(error);
                res.status(500).send('Internal Server Error');
            }
        });
    });

});

module.exports = router;
