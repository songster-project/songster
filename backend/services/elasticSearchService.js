var database = require('../../config/database');
var settings = require('../../config/settings.js');
var elasticSearch = require('elasticsearch');
var elasticSearchClient = new elasticSearch.Client({
    host: settings.elasticSearch_url,
    log: 'info'
});

function errorCallback(error, response) {
    console.log('elastic search error:');
    console.log(error);
}

function create(type, obj) {
    // normalize id, because elastic search complains about the usage of _id
    var id = obj['_id'];
    obj['id'] = obj['_id'];
    delete obj['_id'];

    return elasticSearchClient.create({
        index: settings.elasticSearch_index,
        type: type,
        id: '' + id,
        body: obj
    }, errorCallback);
}

function update(type, obj) {
    var id = obj['_id'];
    obj['id'] = obj['_id'];
    delete obj['_id'];

    return elasticSearchClient.update({
        index: settings.elasticSearch_index,
        type: type,
        id: '' + id,
        body: obj
    }, errorCallback);
}

function reindex(type) {
    var collection = database.db.collection(type);
    collection.find().toArray(function (err, docs) {
        if (err) {
            res.status(500).send('Internal server error');
            console.log(err);
            return;
        }
        docs.forEach(function (doc) {
            create(type, doc);
        });
    });
}

exports.dropAllIndices = function dropAllIndices() {
    return elasticSearchClient.indices.delete({
        index: '_all'
    }).then(function () {
        console.log("Dropped elastic search indices")
    }, errorCallback);
};

exports.reindexSongs = function () {
    return reindex('song');
};

exports.createSong = function createSong(song) {
    return create('song', song);
};

exports.updateSong = function updateSong(song) {
    return update('song', song);
};

exports.escape = function escape(str) {
    // http://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Escaping Special Characters
    // + - && || ! ( ) { } [ ] ^ " ~ * ? : \
    return ('' + str).replace(/([-\\&\|!\(\){}\[\]\^"~\*\?:\+])/g, "\\$1");
};

exports.parseQuery = function parseQuery(query) {
    return '*' + ('' + query).replace(/\s+/g, '* *') + '*';
};

exports.getClient = function () {
    return elasticSearchClient;
};