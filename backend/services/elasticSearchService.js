var database = require('../../config/database');
var elasticSearch = require('elasticsearch');
var elasticSearchClient = new elasticSearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

function errorCallback(error, response) {
    console.log('elastic search error');
    console.log(error);
}

function index(type, obj) {
    // normalize id, because elastic search complains about the usage of _id
    obj['id'] = obj['_id'];
    delete obj['_id'];

    return elasticSearchClient.index({
        index: 'songster',
        type: type,
        body: obj
    }, errorCallback);
}

function reindex(type) {
    // TODO mega dirty timeout hack :( 'database' is null
    // does someone has a better idea? maybe a promise or an event call?
    setTimeout(function () {
        var collection = database.db.collection(type);
        collection.find().toArray(function (err, docs) {
            if (err) {
                res.status(500).send('Internal server error');
                console.log(err);
                return;
            }
            docs.forEach(function (doc) {
                index(type, doc);
            });
        });
    }, 2000);

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

exports.indexSong = function indexSong(song) {
    return index('song', song);
};