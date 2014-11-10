var settings = require('./settings');
var mongoose = require('mongoose');

// are defined bin/www
exports.conn = null;
exports.db = null;
exports.gfs = null;

//Schema Definitions
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var songTypes = 'file youtube'.split(' ');
var voteTypes = 'vote suggestion'.split(' ');
var voteStates = 'new played'.split(' ');

//Indices:
//Every schema has default a primary key _id of type ObjectID.
//Every schema has a default indices on _id


var userSchema = new Schema({
        name: String
        //TODO LF: add here what properties of the User you need, note: object_id is automatically created
    },
    {collection: 'user'}
);

var songSchema = new Schema({
        owner_id: {type: ObjectId, index: true}, //Referencing to user
        addedDate: {type: Date, default: Date.now},
        file_id: ObjectId, //Referencing to the file_id in the files collection
        active: {type: Boolean, default: true},
        type: {type: String, enum: songTypes},
        rating: {type: Number, min: 1, max: 5, default: null}, //must be integer value

        //one of them will be filled
        filename: String,
        url: String,

        //Common Metadata
        title: String,
        artist: String,
        album: String
        //Other metadata may be added

    },
    {collection: 'song'});
//Index for support of getting all the non-deleted indices of a user
songSchema.index({owner_id: 1, active: 1});

var playlistSchema = new Schema({
        owner_id: {type: ObjectId, index: true}, //Referencing to user
        name: String,
        songs: [ObjectId] //Referencing to songs that also have to belong to the same user
    },
    {collection: 'playlist'});

var eventSchema = new Schema({
    owner_id: ObjectId, //Referencing to user
    name: String,
    description: String,
    accessKey: String, //for accessing the event
    start: {type: Date, default: Date.now},
    end: {type: Date, default: null},
    votingEnabled: Boolean,
    previewEnabled: Boolean,
    suggestionEnabled: Boolean
}, {collection: 'event'});

var voteSchema = new Schema({
    owner_id: ObjectId, //Referencing to users, might be null
    type: {type: String, enum: voteTypes},
    state: {type: String, enum: voteStates},
    song_id: ObjectId, //Referencing to the song suggested
    event_id: {type: ObjectId, index: true} //Referencing to the event that this vote was posted
}, {collection: 'vote'});

var eventLogSchema = new Schema({
    event_id: {type: ObjectId, index: true}, //Referencing to the event that log comes from
    logDate: {type: Date, default: Date.now},
    message: {} //Any Json object you want to log
    //Examples that will be logged: start,end, song_id+timestamp
}, {collection: 'eventLog'});

//For storing the state of the queue
//Not sure if we gonna need this
var queueStateSchema = new Schema({
    event_id: ObjectId,
    songs: [ObjectId]
}, {collection: 'queueState'});

//Schema to Models
var User = mongoose.model('User', userSchema);
var Song = mongoose.model('Song', songSchema);
var Playlist = mongoose.model('Playlist', playlistSchema);
var Event = mongoose.model('Event', eventSchema);
var Vote = mongoose.model('Vote', voteSchema);
var EventLog = mongoose.model('EventLog', eventLogSchema);
var QueueStateSchema = mongoose.model('QueueState', queueStateSchema);

console.log('Schemas created');