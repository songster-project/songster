var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var settings = require('../config/settings.js');
var elasticSearchService = require('../backend/services/elasticSearchService');
var db = require('../config/database');
var util = require('util');

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
    } else {
        addDefaultSongOrder(body);
    }

    // filter
    body["filter"] = createUserSongFilter(req.user);

    // pagination
    addPagination(body, req.query);

    searchSongs(res, body);
});

router.get('/artist', passport.ensureAuthenticated, function (req, res) {
    var body = {};

    // filter
    body["query"] = {
        "filtered": {
            "filter": createUserSongFilter(req.user)
        }
    };

    // aggregations
    body["aggs"] = {
        "artists": createSongArtistAggregation()
    };

    // we set the size to 0, because we don't to have any results, only aggregations
    body["size"] = 0;

    searchSongs(res, body);
});

router.get('/album', passport.ensureAuthenticated, function (req, res) {
    var body = {};

    // filter
    body["query"] = {
        "filtered": {
            "filter": createUserSongFilter(req.user)
        }
    };

    // aggregations
    body["aggs"] = {
        "albums": createSongAlbumAggregation()
    };

    // we set the size to 0, because we don't to have any results, only aggregations
    body["size"] = 0;

    searchSongs(res, body);
});

router.get('/random', passport.ensureAuthenticated, function (req, res) {
    var body = {};

    body["query"] = {
        "function_score": {
            "filter": createUserSongFilter(req.user),
            "functions": [{
                "random_score": {
                    "seed": ('' + Math.random()).substring(2)
                }
            }],
            "score_mode": "sum"
        }
    };

    // pagination
    addPagination(body, req.query);

    searchSongs(res, body);
});

router.get('/event/:eventid/song', passport.ensureAuthenticated, function (req, res) {

    // Validation
    req.checkParams('eventid', 'ID is not a valid ID').isMongoID();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }

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
        } else {
            addDefaultSongOrder(body);
        }

        // filter
        body["filter"] = createUserOrEventSongFilter(req.user, event);

        // pagination
        addPagination(body, req.query);

        searchSongs(res, body);
    });

});

router.get('/event/:eventid/artist', passport.ensureAuthenticated, function (req, res) {

    // Validation
    req.checkParams('eventid', 'ID is not a valid ID').isMongoID();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }

    // get active event with eventid from req.param
    db.Event.findOne({_id: req.param('eventid'), end: null}, function (err, event) {
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

        // filter
        body["query"] = {
            "filtered": {
                "filter": createUserOrEventSongFilter(req.user, event)
            }
        };

        // aggregations
        body["aggs"] = {
            "artists": createSongArtistAggregation()
        };

        // we set the size to 0, because we don't to have any results, only aggregations
        body["size"] = 0;

        searchSongs(res, body);
    });

});

router.get('/event/:eventid/album', passport.ensureAuthenticated, function (req, res) {

    // Validation
    req.checkParams('eventid', 'ID is not a valid ID').isMongoID();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }

    // get active event with eventid from req.param
    db.Event.findOne({_id: req.param('eventid'), end: null}, function (err, event) {
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

        // filter
        body["query"] = {
            "filtered": {
                "filter": createUserOrEventSongFilter(req.user, event)
            }
        };

        // aggregations
        body["aggs"] = {
            "albums": createSongAlbumAggregation()
        };

        // we set the size to 0, because we don't to have any results, only aggregations
        body["size"] = 0;

        searchSongs(res, body);
    });

});

router.get('/event/:eventid/random', passport.ensureAuthenticated, function (req, res) {

    // Validation
    req.checkParams('eventid', 'ID is not a valid ID').isMongoID();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('There have been validation errors: ' + util.inspect(errors));
        return;
    }

    var query = req.query.q;
    // get active event with eventid from req.param
    db.Event.findOne({_id: req.param('eventid'), end: null}, function (err, event) {
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

        body["query"] = {
            "function_score": {
                "filter": createUserOrEventSongFilter(req.user, event),
                "functions": [{
                    "random_score": {
                        "seed": ('' + Math.random()).substring(2)
                    }
                }],
                "score_mode": "sum"
            }
        };

        // pagination
        addPagination(body, req.query);

        searchSongs(res, body);
    });

});

function createUserSongFilter(user) {
    return {
        "and": [{
            "term": {
                "owner_id": user._id
            }
        }, {
            "term": {
                "active": true
            }
        }]
    };
}

function createUserOrEventSongFilter(user, event) {
    return {
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
                        "owner_id": user._id
                    }
                }
            ],
            "must_not": []
        }
    };
}

function createSongArtistAggregation() {
    return {
        "terms": {
            "field": "artist.raw",
            "order": {"_term": "asc"}
        }
    };
}

function createSongAlbumAggregation() {
    return {
        "terms": {
            "field": "album.raw",
            "order": {"_term": "asc"}
        }
    };
}

function addDefaultSongOrder(body) {
    body["sort"] = [
        { "artist.raw" : "asc" },
        { "album.raw" : "asc" },
        { "title.raw" : "asc" },
        "_score"
    ];
}

function searchSongs(res, esBody) {
    return search(res, esBody, 'song');
}

function search(res, esBody, type) {
    elasticSearchService.getClient().search({
        index: settings.elasticSearch_index,
        type: type,
        body: esBody
    }, function (error, response) {
        if (!error) {
            res.send(response);
        } else {
            console.log("Elastic Search Error");
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    })
}

module.exports = router;
