// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');
var database = require('../lib/database');

describe('EventLogApi', function () {
    var eid;
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
            .end(function (err) {
                expect(err).to.not.exist;

                process.nextTick(function () {
                    cb(err);
                    done();
                });
            });


    });

    afterEach(function (done) {
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    //Logged In
    //#########################################################################################

    it('should send empty websocket request if there is no log', function (done) {

        api.get('/event').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.be.empty;
            var postdata = {
                "name": "websocketEvent1",
                "accessKey": "theKey",
                "owner_id": "5489e22a2b6671a414dcab8f",
                "suggestionEnabled": true,
                "votingEnabled": true,
                "previewEnabled": true
            };
            api.post('/event').send(postdata).end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.body).to.contain.key('start');
                eid = res.body._id;
                var first = true;
                var nClient = require('../lib/notification_client');
                var data = {
                    eventid: eid
                };
                nClient.register_to_event('music_changed', function (msg) {
                    if (first) {
                        expect(msg.lastSongs.length).to.equal(0);
                        expect(msg.nextSongs).to.not.exist;
                        first = false;
                        done();
                    }
                }, data);
            });
        });
    });

    it('should update next songs on queuechanged', function (done) {
        var postdata = {
            message: {
                nextSongs: [{
                    id: "5489e267663534a4148bdfaaa111",
                    _id: "5489e267663534a4148bdfaaa111",
                    title: "Meet The Enemy",
                    artist: "Eluveitie",
                    album: "Helvetios",
                    year: "",
                    cover: "5489e2682b6671a414dcab9c",
                    file_id: "5489e2612b6671a414dcab93",
                    addedDate: "2014-12-11T18:28:49.658Z",
                    src: "/song/5489e2612b6671a414dcab93/raw",
                    type: "audio/mp3"
                }]
            },
            type: "queuechanged"
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
                    if (started) {
                        started = false;
                        expect(msg.nextSongs[0].id).to.equal(postdata.message.nextSongs[0].id);
                        done();
                    }
                }, data);
            });
        });
    });

    it('should log songs if message is correct with next songs', function (done) {
        var postdata = {
            message: {
                currentSong: {
                    id: "5489e267663534a4148bdfaaa112",
                    _id: "5489e267663534a4148bdfaaa112",
                    title: "Contrails",
                    artist: "Glowworm",
                    album: "The Coachlight Woods",
                    year: "",
                    cover: "5489e2672b6671a414dcab9a",
                    file_id: "5489e2612b6671a414dcab94",
                    addedDate: "2014-12-11T18:28:49.672Z",
                    src: "/song/5489e2612b6671a414dcab94/raw",
                    type: "audio/mp3"
                },
                nextSongs: [{
                    id: "5489e267663534a4148bdfaaa113",
                    _id: "5489e267663534a4148bdfaaa113",
                    title: "Meet The Enemy",
                    artist: "Eluveitie",
                    album: "Helvetios",
                    year: "",
                    cover: "5489e2682b6671a414dcab9c",
                    file_id: "5489e2612b6671a414dcab93",
                    addedDate: "2014-12-11T18:28:49.658Z",
                    src: "/song/5489e2612b6671a414dcab93/raw",
                    type: "audio/mp3"
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
                        expect((logEntries[0].message).currentSong.id).to.equal(postdata.message.currentSong.id);
                        expect((logEntries[0].message).nextSongs[0].id).to.equal(postdata.message.nextSongs[0].id);
                        expect(logEntries[0].type).to.equal(postdata.type);
                        done();
                    }
                }
            );
        });
    });

    it('should log songs if message is correct without next songs', function (done) {
        var postdata = {
            message: {
                currentSong: {
                    id: "5489e267663534a4148bdfaaa114",
                    _id: "5489e267663534a4148bdfaaa114",
                    title: "Contrails",
                    artist: "Glowworm",
                    album: "The Coachlight Woods",
                    year: "",
                    cover: "5489e2672b6671a414dcab9a",
                    file_id: "5489e2612b6671a414dcab94",
                    addedDate: "2014-12-11T18:28:49.672Z",
                    src: "/song/5489e2612b6671a414dcab94/raw",
                    type: "audio/mp3"
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
                        expect((logEntries[0].message).currentSong.id).to.equal(postdata.message.currentSong.id);
                        expect(logEntries[0].type).to.equal(postdata.type);
                        expect((logEntries[0].message).nextSongs).to.not.be.ok;
                        done();
                    }
                }
            );
        });
    });

    it('should return 400, if message is missing in request', function (done) {
        var postdata = {
            type: "songplayed"
        };
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
                    id: "5489e267663534a4148bdfaaa115",
                    _id: "5489e267663534a4148bdfaaa115",
                    title: "Contrails",
                    artist: "Glowworm",
                    album: "The Coachlight Woods",
                    year: "",
                    cover: "5489e2672b6671a414dcab9a",
                    file_id: "5489e2612b6671a414dcab94",
                    addedDate: "2014-12-11T18:28:49.672Z",
                    src: "/song/5489e2612b6671a414dcab94/raw",
                    type: "audio/mp3"
                },
                nextSongs: [{
                    id: "5489e267663534a4148bdfaaa116",
                    _id: "5489e267663534a4148bdfaaa116",
                    title: "Meet The Enemy",
                    artist: "Eluveitie",
                    album: "Helvetios",
                    year: "",
                    cover: "5489e2682b6671a414dcab9c",
                    file_id: "5489e2612b6671a414dcab93",
                    addedDate: "2014-12-11T18:28:49.658Z",
                    src: "/song/5489e2612b6671a414dcab93/raw",
                    type: "audio/mp3"
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
                    id: "5489e267663534a4148bdfaaa117",
                    _id: "5489e267663534a4148bdfaaa117",
                    title: "Contrails",
                    artist: "Glowworm",
                    album: "The Coachlight Woods",
                    year: "",
                    cover: "5489e2672b6671a414dcab9a",
                    file_id: "5489e2612b6671a414dcab94",
                    addedDate: "2014-12-11T18:28:49.672Z",
                    src: "/song/5489e2612b6671a414dcab94/raw",
                    type: "audio/mp3"
                },
                nextSongs: [{
                    id: "5489e267663534a4148bdfaaa118",
                    _id: "5489e267663534a4148bdfaaa118",
                    title: "Meet The Enemy",
                    artist: "Eluveitie",
                    album: "Helvetios",
                    year: "",
                    cover: "5489e2682b6671a414dcab9c",
                    file_id: "5489e2612b6671a414dcab93",
                    addedDate: "2014-12-11T18:28:49.658Z",
                    src: "/song/5489e2612b6671a414dcab93/raw",
                    type: "audio/mp3"
                }]
            },
            type: "wrong type"
        };
        api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.statusCode).to.equal(500);
            done();
        });
    });

    it('should log event start message', function (done) {
        var postdata = {
            message: {
                "date": 1418368318934
            },
            type: "eventstart"
        };

        api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.statusCode).to.equal(201);
            done();
        });
    });

    it('should log event end message', function (done) {
        var postdata = {
            message: {
                "date": 1418368318934
            },
            type: "eventend"
        };

        api.post('/eventlog/' + eid).send(postdata).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.statusCode).to.equal(201);
            done();
        });
    });

    it('should send websocket request if data is correct', function (done) {
        var postdata = {
            message: {
                currentSong: {
                    id: "5489e267663534a4148bdfaaa119",
                    _id: "5489e267663534a4148bdfaaa119",
                    title: "Contrails",
                    artist: "Glowworm",
                    album: "The Coachlight Woods",
                    year: "",
                    cover: "5489e2672b6671a414dcab9a",
                    file_id: "5489e2612b6671a414dcab94",
                    addedDate: "2014-12-11T18:28:49.672Z",
                    src: "/song/5489e2612b6671a414dcab94/raw",
                    type: "audio/mp3"
                },
                nextSongs: [{
                    id: "5489e267663534a4148bdfaaa120",
                    _id: "5489e267663534a4148bdfaaa120",
                    title: "Meet The Enemy",
                    artist: "Eluveitie",
                    album: "Helvetios",
                    year: "",
                    cover: "5489e2682b6671a414dcab9c",
                    file_id: "5489e2612b6671a414dcab93",
                    addedDate: "2014-12-11T18:28:49.658Z",
                    src: "/song/5489e2612b6671a414dcab93/raw",
                    type: "audio/mp3"
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
                    if (started) {
                        started = false;
                        expect(msg.currentSong.id).to.equal(postdata.message.currentSong.id);
                        expect(msg.nextSongs[0].id).to.equal(postdata.message.nextSongs[0].id);
                        done();
                    }
                }, data);
            });
        });
    });

    it('next songs should be empty if preview is deativated', function (done) {
        var id;
        var postdata = {
            message: {
                currentSong: {
                    id: "5489e267663534a4148bdfaaa121",
                    _id: "5489e267663534a4148bdfaaa121",
                    title: "Contrails",
                    artist: "Glowworm",
                    album: "The Coachlight Woods",
                    year: "",
                    cover: "5489e2672b6671a414dcab9a",
                    file_id: "5489e2612b6671a414dcab94",
                    addedDate: "2014-12-11T18:28:49.672Z",
                    src: "/song/5489e2612b6671a414dcab94/raw",
                    type: "audio/mp3"
                },
                nextSongs: [{
                    id: "5489e267663534a4148bdfaaa122",
                    _id: "5489e267663534a4148bdfaaa122",
                    title: "Meet The Enemy",
                    artist: "Eluveitie",
                    album: "Helvetios",
                    year: "",
                    cover: "5489e2682b6671a414dcab9c",
                    file_id: "5489e2612b6671a414dcab93",
                    addedDate: "2014-12-11T18:28:49.658Z",
                    src: "/song/5489e2612b6671a414dcab93/raw",
                    type: "audio/mp3"
                }]
            },
            type: "songplayed"
        };
        api.put('/event/current/end').send({}).end(function (err, res) {
            var eventdata = {
                "name": "websocketEvent2",
                "accessKey": "theKey",
                "owner_id": "5489e22a2b6671a414dcab8f",
                "suggestionEnabled": true,
                "votingEnabled": true,
                "previewEnabled": false
            };
            api.get('/event').end(function (err, res) {
                api.post('/event').send(eventdata).end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.body).to.contain.key('start');
                    id = res.body._id;
                    api.post('/eventlog/' + id).send(postdata).end(function (err, res) {
                        expect(err).to.not.be.ok;
                        expect(res.statusCode).to.equal(201);
                        postdata.message.currentSong={
                            id: "5489e267663534a4148bdfaaa123",
                            _id: "5489e267663534a4148bdfaaa123",
                            title: "Contrails",
                            artist: "Glowworm",
                            album: "The Coachlight Woods",
                            year: "",
                            cover: "5489e2672b6671a414dcab9a",
                            file_id: "5489e2612b6671a414dcab94",
                            addedDate: "2014-12-11T18:28:49.672Z",
                            src: "/song/5489e2612b6671a414dcab94/raw",
                            type: "audio/mp3"
                        };

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
                                    expect(msg.lastSongs[msg.lastSongs.length - 1].id).to.equal("5489e267663534a4148bdfaaa121");
                                    expect(msg.currentSong.id).to.equal(postdata.message.currentSong.id);
                                    expect(msg.nextSongs.length).to.equal(0);
                                    api.put('/event/current/end').send({}).end(function (err, res) {
                                        done();
                                    });
                                }
                            }, data);
                        });
                    });
                });
            });
        });
    });

});