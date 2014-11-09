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
var voteStates = 'new moved played'.split(' ');

var userSchema = new Schema({
        name: String
        //TODO LF: add here what properties of the User you need, note: object_id is automatically created
    },
    {collection: 'user'}
);

var songSchema = new Schema({
        owner_id: ObjectId, //Referencing to user
        addedDate:  { type: Date, default: Date.now },
        file_id: ObjectId, //Referencing to the file_id in the files collection
        active: { type: Boolean, default: true},
        type: {type: String, enum: songTypes},
        rating: {type: Number, min:1, max:5, default: null}, //must be integer value

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

var playlistSchema = new Schema({
        owner_id: ObjectId, //Referencing to user
        name: String,
        songs: [ObjectId] //Referencing to songs that also have to belong to the same user
},
    {collection: 'playlist'});

var eventSchema = new Schema({
    owner_id: ObjectId, //Referencing to user
    name: String,
    description: String,
    link: String,
    start: { type: Date, default: Date.now},
    end: { type: Date, default: null},
    votingEnabled: Boolean,
    previewEnabled: Boolean,
    suggestionEnabled: Boolean

}, {collection: 'event'});

var voteSchema = new Schema({
    owner_id: ObjectId, //Referencing to users, might be null
    type: {type: String, enum: voteTypes},
    state: {type: string, enum: voteStates},
    song_id: ObjectId, //Referencing to the song suggested
    event_id: ObjectId //Referencing to the event that this vote was posted
}, {collection: 'vote'});

var eventlogSchema = new Schema({
    event_id: ObjectId, //Referencing to the event that log comes from
    logDate: {type: Date, default: Date.now},
    message: {} //Any Json object you want to log
}, {collection: 'eventlog'});

//Schema to Models
var User = mongoose.model('User',userSchema);
var Song = mongoose.model('Song',songSchema);
var Playlist = mongoose.model('Playlist',playlistSchema);
var Event = mongoose.model('Event',eventSchema);
var Vote = mongoose.model('Vote',voteSchema);
var Eventlog = mongoose.model('Eventlog',eventlogSchema);

console.log('Schemas created');