var database = require('../../config/database');
var settings = require('../../config/settings.js');
var elasticSearch = require('elasticsearch');
var elasticSearchClient = new elasticSearch.Client({
    host: settings.elasticSearch_url,
    log: 'info'
});

function callback(error, response) {
    if (error) {
        console.log('elastic search error:');
        console.log(error);
    }
}

function index(type, obj) {
    // normalize id, because elastic search can not store _id (because it already exists as an internal id)
    var id = obj['_id'];
    obj['id'] = obj['_id'];
    delete obj['_id'];

    return elasticSearchClient.index({
        index: settings.elasticSearch_index,
        type: type,
        id: '' + id,
        body: obj
    }, callback);
}

function reindex(type) {
    var collection = database.db.collection(type);
    collection.find().toArray(function (err, docs) {
        if (err) {
            console.log(err);
            return;
        }
        docs.forEach(function (doc) {
            index(type, doc);
        });
        console.log("Reindex " + type);
    });
}

exports.dropAllIndices = function dropAllIndices() {
    return elasticSearchClient.indices.delete({
        index: '_all'
    }).then(function () {
        console.log("Dropped elastic search indices")
    }, callback);
};

exports.reindexSongs = function () {
    // create index
    return elasticSearchClient.indices.create({
        index: settings.elasticSearch_index
    }).then(function () {
        // add mapping
        elasticSearchClient.indices.putMapping({
            index: settings.elasticSearch_index,
            type: 'song',
            body: {
                "song": {
                    "properties": {
                        "artist": {
                            "type": "string",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed"
                                }
                            }
                        },
                        "album": {
                            "type": "string",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed"
                                }
                            }
                        }
                    }
                }
            }
        }).then(function() {
            reindex('song');
        });
    });
};

exports.indexSong = function createSong(song) {
    return index('song', song);
};

exports.escape = function escape(str) {
    // http://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Escaping Special Characters
    // + - && || ! ( ) { } [ ] ^ " ~ * ? : \
    return ('' + str)
        .replace(/([-\\&\|!\(\){}\[\]\^"~\*\?:\+])/g, "\\$1") // lucene special characters

        // TODO does not work... I don't know why. so I just replace the / with a space
        // the problem with that is, that we can not search for slashes -> /
        //.replace(/([/])/g, "\\$1"); // special character for regex in lucene
        .replace(/([/])/g, " ");
};

exports.parseQuery = function parseQuery(query) {
    return '*' +
        ('' + query)
            .trim()
            .replace(/\s{2,}/g, ' ') // remove double spaces
            .replace(/\s+/g, '* *') +
        '*';
};

exports.getClient = function () {
    return elasticSearchClient;
};