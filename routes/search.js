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

function addPagination(body, params) {
    if(params.from !== undefined) {
        body.from = params.from;
    }
    if(params.size !== undefined) {
        body.size = params.size;
    }
}

router.get('/song', passport.ensureAuthenticated, function (req, res) {
    var query = req.query.q;

    var body = {};
    if (query !== undefined) {
        // specific song search
        var escapedQuery = elasticSearchService.escape(query);
        var parsedQuery = elasticSearchService.parseQuery(escapedQuery);
        body["query"] = {
            "query_string": {
                "query": parsedQuery,
                "fields": searchableFields,
                "default_operator": "or"
            }
        };
    }

    // filter
    body["filter"] = {
        "and": [
            {
                "term": {
                    "owner_id": req.user._id
                }
            },{
                "term": {
                    "active": true
                }
            }
        ]
    };

    // pagination
    addPagination(body, req.query);

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

router.get('/event/:eventid/song', passport.ensureAuthenticated, function (req, res) {
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

        var body = {};

        var escapedQuery = elasticSearchService.escape(query);
        var parsedQuery = elasticSearchService.parseQuery(escapedQuery);
        body["query"] = {
            "query_string": {
                "query": parsedQuery,
                "fields": searchableFields,
                "default_operator": "or"
            }
        };

        // filter
        body["filter"] = {
            "bool": {
                "must": [{
                    "term": {
                        "active": true
                    }
                }],
                "should": [
                    {
                        "term": {
                            "owner_id": event.owner_id
                        }
                    },
                    {
                        "term": {
                            "owner_id": req.user._id
                        }
                    }
                ],
                "must_not": []
            }
        };

        // pagination
        addPagination(body, req.query);

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

});

module.exports = router;
