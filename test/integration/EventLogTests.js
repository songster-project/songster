// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');
var database = require('../lib/database');

describe('EventApi', function () {
    var eid = '5489e2462b6671a414dcab90';
    this.timeout(10000);
    //Callback - Magic provided by: https://github.com/visionmedia/superagent/issues/314
    //Basically solves that we can be logged in
    beforeEach(function (done) {
        var postdata = {
            "username": "user2",
            "password": "user2"
        };
        var cb = function (x) {
            return;
        };
        api.post('/login')
            .send(postdata)
            .end(function (err, res) {
                expect(err).to.not.exist;

                process.nextTick(function () {
                    cb(err);
                });
                done();
            })


    });

    afterEach(function (done) {
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    //Logged In
    //#########################################################################################

    it('schould send empty websocket request if there is no log', function (done) {
        var first = true;
        var nClient = require('../lib/notification_client');
        var data = {
            eventid: eid
        };
        nClient.register_to_event('music_changed', function (msg) {
            if (first) {
                expect(msg.lastSongs.length).to.equal(0);
                expect(msg.nextSongs.length).to.equal(0);
                first = false;
                done();
            }
        }, data);
    });

    it('schould log songs if message is correct', function (done) {
        var postdata = {
            message: {
                currentSong: {
                    id: "5489e267663534a4148bdfcc",
                    _id: "5489e267663534a4148bdfcc",
                    title: "Contrails",
                    artist: "Glowworm",
                    album: "The Coachlight Woods",
                    year: "",
                    cover: "5489e2672b6671a414dcab9a",
                    file_id: "5489e2612b6671a414dcab94",
                    addedDate: "2014-12-11T18:28:49.672Z",
                    src: "/song/5489e2612b6671a414dcab94/raw",
                    type: "audio/mp3",
                    $$hashKey: "00U"
                },
                nextSongs: [{
                    id: "5489e268663534a4148bdfcd",
                    _id: "5489e268663534a4148bdfcd",
                    title: "Meet The Enemy",
                    artist: "Eluveitie",
                    album: "Helvetios",
                    year: "",
                    cover: "5489e2682b6671a414dcab9c",
                    file_id: "5489e2612b6671a414dcab93",
                    addedDate: "2014-12-11T18:28:49.658Z",
                    src: "/song/5489e2612b6671a414dcab93/raw",
                    type: "audio/mp3",
                    $$hashKey: "00T"
                }]
            },
            type: "songplayed"
        };
        api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.statusCode).to.equal(201);

            database.EventLog.find({
                event_id: eid,
                type: 'songplayed'
            }).sort('-logDate').limit(1).exec(function (err, logEntries) {
                    if (logEntries[0]) {
                        expect(JSON.parse(logEntries[0].message).currentSong.id).to.equal(postdata.message.currentSong.id);
                        expect(JSON.parse(logEntries[0].message).nextSongs[0].id).to.equal(postdata.message.nextSongs[0].id);
                        expect(logEntries[0].type).to.equal(postdata.type);
                        done();
                    }
                }
            );
        });
    });

    it('schould log songs if message is correct', function (done) {
        var postdata = {
            message: {
                currentSong: {
                    id: "5489e267663534a4148bdfaa",
                    _id: "5489e267663534a4148bdfcc",
                    title: "Contrails",
                    artist: "Glowworm",
                    album: "The Coachlight Woods",
                    year: "",
                    cover: "5489e2672b6671a414dcab9a",
                    file_id: "5489e2612b6671a414dcab94",
                    addedDate: "2014-12-11T18:28:49.672Z",
                    src: "/song/5489e2612b6671a414dcab94/raw",
                    type: "audio/mp3",
                    $$hashKey: "00U"
                }
            },
            type: "songplayed"
        };

        api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.statusCode).to.equal(201);

            database.EventLog.find({
                event_id: eid,
                type: 'songplayed'
            }).sort('-logDate').limit(1).exec(function (err, logEntries) {
                    if (logEntries[0]) {
                        expect(JSON.parse(logEntries[0].message).nextSongs).to.not.be.ok;
                        expect(JSON.parse(logEntries[0].message).currentSong.id).to.equal(postdata.message.currentSong.id);
                        expect(logEntries[0].type).to.equal(postdata.type);
                        done();
                    }
                }
            );
        });
    });

    it('should return 400, if message is missing in request', function (done) {
        var postdata = {
            type: "songplayed"
        }
        api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.statusCode).to.equal(400);
            done();
        });
    });

    it('should return 400, if message and type are missing in request', function (done) {
        var postdata = {};
        api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.statusCode).to.equal(400);
            done();
        });
    });

    it('should return 400, if type is missing in request', function (done) {
        var postdata = {
            message: {
                currentSong: {
                    id: "5489e267663534a4148bdfcc",
                    _id: "5489e267663534a4148bdfcc",
                    title: "Contrails",
                    artist: "Glowworm",
                    album: "The Coachlight Woods",
                    year: "",
                    cover: "5489e2672b6671a414dcab9a",
                    file_id: "5489e2612b6671a414dcab94",
                    addedDate: "2014-12-11T18:28:49.672Z",
                    src: "/song/5489e2612b6671a414dcab94/raw",
                    type: "audio/mp3",
                    $$hashKey: "00U"
                },
                nextSongs: [{
                    id: "5489e268663534a4148bdfcd",
                    _id: "5489e268663534a4148bdfcd",
                    title: "Meet The Enemy",
                    artist: "Eluveitie",
                    album: "Helvetios",
                    year: "",
                    cover: "5489e2682b6671a414dcab9c",
                    file_id: "5489e2612b6671a414dcab93",
                    addedDate: "2014-12-11T18:28:49.658Z",
                    src: "/song/5489e2612b6671a414dcab93/raw",
                    type: "audio/mp3",
                    $$hashKey: "00T"
                }]
            }
        };
        api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.statusCode).to.equal(400);
            done();
        });
    });

    it('should return 500, if the type is not correct', function (done) {
        var postdata = {
            message: {
                currentSong: {
                    id: "5489e267663534a4148bdfcc",
                    _id: "5489e267663534a4148bdfcc",
                    title: "Contrails",
                    artist: "Glowworm",
                    album: "The Coachlight Woods",
                    year: "",
                    cover: "5489e2672b6671a414dcab9a",
                    file_id: "5489e2612b6671a414dcab94",
                    addedDate: "2014-12-11T18:28:49.672Z",
                    src: "/song/5489e2612b6671a414dcab94/raw",
                    type: "audio/mp3",
                    $$hashKey: "00U"
                },
                nextSongs: [{
                    id: "5489e268663534a4148bdfcd",
                    _id: "5489e268663534a4148bdfcd",
                    title: "Meet The Enemy",
                    artist: "Eluveitie",
                    album: "Helvetios",
                    year: "",
                    cover: "5489e2682b6671a414dcab9c",
                    file_id: "5489e2612b6671a414dcab93",
                    addedDate: "2014-12-11T18:28:49.658Z",
                    src: "/song/5489e2612b6671a414dcab93/raw",
                    type: "audio/mp3",
                    $$hashKey: "00T"
                }]
            },
            type: "wrong type"
        };

        api.put('/event/current/end').send({}).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body.end).to.not.equal(null);
            api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
                expect(err).to.not.be.ok;
                expect(res.statusCode).to.equal(500);
                done();
            });
        });
    });

    it('should log event start message', function (done) {
        var postdata = {
            message: {
                "$date": 1418368318934
            },
            type: "eventstart"
        };

        api.put('/event/current/end').send({}).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body.end).to.not.equal(null);
            api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
                expect(err).to.not.be.ok;
                expect(res.statusCode).to.equal(201);
                done();
            });
        });
    });

    it('should log event end message', function (done) {
        var postdata = {
            message: {
                "$date": 1418368318934
            },
            type: "eventend"
        };

        api.put('/event/current/end').send({}).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body.end).to.not.equal(null);
            api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
                expect(err).to.not.be.ok;
                expect(res.statusCode).to.equal(201);
                done();
            });
        });
    });

    it('schould send websocket request if data is correct', function (done) {
        var postdata = {
            message: {
                currentSong: {
                    id: "5489e267663534a4148bdfdddddd",
                    _id: "5489e267663534a4148bdfcc",
                    title: "Contrails",
                    artist: "Glowworm",
                    album: "The Coachlight Woods",
                    year: "",
                    cover: "5489e2672b6671a414dcab9a",
                    file_id: "5489e2612b6671a414dcab94",
                    addedDate: "2014-12-11T18:28:49.672Z",
                    src: "/song/5489e2612b6671a414dcab94/raw",
                    type: "audio/mp3",
                    $$hashKey: "00U"
                },
                nextSongs: [{
                    id: "5489e268663534a4148bdgfddd",
                    _id: "5489e268663534a4148bdfcd",
                    title: "Meet The Enemy",
                    artist: "Eluveitie",
                    album: "Helvetios",
                    year: "",
                    cover: "5489e2682b6671a414dcab9c",
                    file_id: "5489e2612b6671a414dcab93",
                    addedDate: "2014-12-11T18:28:49.658Z",
                    src: "/song/5489e2612b6671a414dcab93/raw",
                    type: "audio/mp3",
                    $$hashKey: "00T"
                }]
            },
            type: "songplayed"
        };
        api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.statusCode).to.equal(201);

            api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
                expect(err).to.not.be.ok;
                expect(res.statusCode).to.equal(201);
                var started = true;
                var nClient = require('../lib/notification_client');
                var data = {
                    eventid: eid
                };
                nClient.register_to_event('music_changed', function (msg) {
                    expect(msg.lastSongs[msg.lastSongs.length - 1].id).to.equal(postdata.message.currentSong.id);
                    expect(msg.currentSong.id).to.equal(postdata.message.currentSong.id);
                    expect(msg.nextSongs[0].id).to.equal(postdata.message.nextSongs[0].id);
                    if (started) {
                        started = false;
                        done();
                    }
                }, data);
            });
        });
    });

    it('next songs should be empty if preview is deativated', function (done) {
        var id = '548ad8c6641d12a03923d639';
        var postdata = {
            message: {
                currentSong: {
                    id: "5489e267663534a4148bdfdrt",
                    _id: "5489e267663534a4148bdfcc",
                    title: "Contrails",
                    artist: "Glowworm",
                    album: "The Coachlight Woods",
                    year: "",
                    cover: "5489e2672b6671a414dcab9a",
                    file_id: "5489e2612b6671a414dcab94",
                    addedDate: "2014-12-11T18:28:49.672Z",
                    src: "/song/5489e2612b6671a414dcab94/raw",
                    type: "audio/mp3",
                    $$hashKey: "00U"
                },
                nextSongs: [{
                    id: "5489e268663534a4148bdgrtdd",
                    _id: "5489e268663534a4148bdfcd",
                    title: "Meet The Enemy",
                    artist: "Eluveitie",
                    album: "Helvetios",
                    year: "",
                    cover: "5489e2682b6671a414dcab9c",
                    file_id: "5489e2612b6671a414dcab93",
                    addedDate: "2014-12-11T18:28:49.658Z",
                    src: "/song/5489e2612b6671a414dcab93/raw",
                    type: "audio/mp3",
                    $$hashKey: "00T"
                }]
            },
            type: "songplayed"
        };
        api.post('/eventlog/' + id).send(postdata).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.statusCode).to.equal(201);

            api.post('/eventlog/' + id).send(postdata).end(function (err, res) {
                expect(err).to.not.be.ok;
                expect(res.statusCode).to.equal(201);
                var started = true;
                var nClient = require('../lib/notification_client');
                var data = {
                    eventid: id
                };
                nClient.register_to_event('music_changed', function (msg) {
                    if (started) {
                        started = false;
                        expect(msg.lastSongs.length).to.equal(1);
                        expect(msg.lastSongs[msg.lastSongs.length - 1].id).to.equal(postdata.message.currentSong.id);
                        expect(msg.currentSong.id).to.equal(postdata.message.currentSong.id);
                        expect(msg.nextSongs.length).to.equal(0);
                        done();
                    }
                }, data);
            });
        });
    });

});