var database = require('../../config/database');
var settings = require('../../config/settings');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');

mongodb.MongoClient.connect(settings.mongo_url, function (err, db) {
    if (err) throw err;

    database.db = db;
    database.conn = mongoose.createConnection(settings.mongo_url, {server: {poolSize: 500}});

    database.conn.once('open', function (err) {
        if (err) {
            throw err;
        } else {

            database.gfs = Grid(database.conn.db, mongoose.mongo);
            database.User = database.conn.model('User', database.UserSchema);
            database.Vote = database.conn.model('Vote', database.VoteSchema);
            database.Event = database.conn.model('Event', database.EventSchema);
            database.Playlist = database.conn.model('Playlist', database.PlaylistSchema);
            database.EventLog = database.conn.model('EventLog', database.EventlogSchema);
            database.Song = database.conn.model('Song', database.SongSchema);
        }
    });
});

module.exports=database;