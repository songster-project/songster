var settings = require('./settings');
var mongoose = require('mongoose');

// are defined bin/www
exports.conn = null;
exports.db = null;
exports.gfs = null;
exports.User = null;
exports.Song = null;
exports.Playlist = null;
exports.Event = null;
exports.Vote = null;
exports.EventLog = null;
exports.QueueStateSchema = null;

//Schema Definitions
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var songTypes = 'file youtube'.split(' ');
var voteTypes = 'vote suggestion'.split(' ');
var voteStates = 'new played'.split(' ');
var logTypes = 'songplayed eventstart eventend songvoted'.split(' ');

//Indices:
//Every schema has default a primary key _id of type ObjectID.
//Every schema has a default indices on _id


var userSchema = new Schema({
        username: {type: String, index :{unique: true}},
        password: String,
        email: String,
        first_name: String,
        last_name: String,
        salt: String,
        anonymous: {type: Boolean, default: false}
    },
    {collection: 'user'}
);

userSchema.index({username: 1, password: 1});
userSchema.set('autoIndex',true);

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
        album: String,
        year: String,
        //Other metadata may be added

        // the GFS id of the cover if available
        cover: ObjectId
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
    start: {type: Date, default: Date.now},
    end: {type: Date, default: null},
    votingEnabled: Boolean,
    previewEnabled: Boolean,
    suggestionEnabled: Boolean,
    deleted: {type: Boolean, default: false}
}, {collection: 'event'});

var voteSchema = new Schema({
    owner_id: ObjectId, //Referencing to users, might be null
    type: {type: String, enum: voteTypes},
    state: {type: String, enum: voteStates},
    song_id: {type: ObjectId, ref: 'Song' }, //Referencing to the song suggested
    event_id: {type: ObjectId, index: true}, //Referencing to the event that this vote was posted
    date: {type: Date, default: Date.now},
    suggestion_type: {type: String, enum: songTypes},
    video_id: String
}, {collection: 'vote'});

var eventLogSchema = new Schema({
    event_id: {type: ObjectId, index: true}, //Referencing to the event that log comes from
    logDate: {type: Date, default: Date.now},
    message: {}, //Any Json object you want to log
    //Examples that will be logged: start,end, song_id+timestamp
    type: {type: String, enum: logTypes}
}, {collection: 'eventLog'});

//Due to bad performance i built a little cache for the shortend links
var longShortUrlSchema = new Schema({
    long :{type: String, index:true},
    short :{type: String}
}, {collection: 'longShortUrls'});


//For storing the state of the queue
//Not sure if we gonna need this
//var queueStateSchema = new Schema({
//    event_id: ObjectId,
//    songs: [ObjectId]
//}, {collection: 'queueState'});

//Export Schema to make them available to bin/ww
exports.UserSchema = userSchema;
exports.SongSchema = songSchema;
exports.PlaylistSchema = playlistSchema;
exports.EventSchema = eventSchema;
exports.VoteSchema = voteSchema;
exports.EventlogSchema = eventLogSchema;
exports.LongShortUrlSchema = longShortUrlSchema;