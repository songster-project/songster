// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');
var database = require('../lib/database');

describe('VotingApiTests', function () {
    var eid;
    this.timeout(10000);

    var postdata_dj = {
        "username": "user3",
        "password": "user3"
    };

    var postdata_user = {
        "username": "user2",
        "password": "user2"
    };

    // before all tests create event as user1
    before(function (done) {

        var cb = function (x) {
            return;
        };
        api.post('/login')
            .send(postdata_dj)
            .end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.status).to.equal(302);

                // create event as user1
                api.get('/event').end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.body).to.be.empty;
                    var postdata = {
                        "name": "votingEvent1",
                        "accessKey": "theKey",
                        "owner_id": "54a3b95eedcf85150a52bfd3",
                        "suggestionEnabled": true,
                        "votingEnabled": true,
                        "previewEnabled": true
                    };
                    api.post('/event').send(postdata).end(function (err, res) {
                        expect(err).to.not.exist;
                        expect(res.body).to.contain.key('start');
                        eid = res.body._id;

                        // logout user1
                        api.get('/logout').end(function (err, res) {
                            expect(err).to.not.exist;
                            expect(res.status).to.equal(302);

                            process.nextTick(function () {
                                cb(err);
                                done();
                            });
                        });
                    });
                });
            });
    });

    beforeEach(function (done) {

        var cb = function (x) {
            return;
        };
        api.post('/login')
            .send(postdata_user)
            .end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.status).to.equal(302);

                process.nextTick(function () {
                    cb(err);
                    done();
                });
            });
    });

    afterEach(function (done) {
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(302);
            done();
        });
    });

    // close event and logout user
    after(function (done) {

        // logout current voting user
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(302);

            // login dj again
            api.post('/login')
                .send(postdata_dj)
                .end(function (err) {
                    expect(err).to.not.exist;

                    // end event of dj
                    api.put('/event/current/end').send({}).end(function (err, res) {
                        expect(err).to.not.exist;
                        expect(res.status).to.equal(200);
                        expect(res.body.end).to.not.equal(null);

                        // logout dj
                        api.get('/logout').end(function (err, res) {
                            expect(err).to.not.exist;
                            done();
                        });
                    });
                });

        });
    });

    //Logged In
    //#########################################################################################

    it('votes should update if song changed and song was a suggestion - no clients registered', function (done) {
        var suggestdata = {
            "type": "suggestion",
            "state": "new",
            "song_id": "5489e267663534a4148bdfcc",
            "event_id": eid,
            "suggestion_type": 'file'
        };

        api.post('/voting/' + eid).send(suggestdata).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            expect(res.status).to.equal(201);
            expect(res.body.song_id).to.equal("5489e267663534a4148bdfcc");
            api.get('/logout').end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.status).to.equal(302);
                api.post('/login')
                    .send(postdata_dj)
                    .end(function (err, res) {
                        expect(err).to.not.exist;
                        expect(res.status).to.equal(302);
                        var songdata = {
                            message: {
                                currentSong: {
                                    id: "5489e267663534a4148bdfcc",
                                    _id: "5489e267663534a4148bdfcc"
                                }
                            },
                            type: "songplayed"
                        };

                        var first = true;
                        var nClient = require('../lib/notification_client');
                        var data = {
                            eventid: eid
                        };

                        nClient.register_to_event('suggestion_played', function (vote) {
                        }, data);

                        nClient.register_to_event('votes_changed', function (vote) {
                            expect(vote).to.exist;
                            if (first) {
                                expect(vote.song_id._id).to.equal("5489e267663534a4148bdfcc");
                                first = false;
                                done();
                            }
                        }, data);

                        api.post('/eventlog/' + eid).send(songdata).end(function (err, res) {
                            expect(err).to.not.be.ok;
                            expect(res.statusCode).to.equal(201);
                        });
                    });
            });
        });
    });

    it('votes should update if song changed and song was a suggestion - other clients already registered', function (done) {
        var suggestdata = {
            "type": "suggestion",
            "state": "new",
            "song_id": "5489e268663534a4148bdfcd",
            "event_id": eid,
            "suggestion_type": 'file'
        };

        api.post('/voting/' + eid).send(suggestdata).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            expect(res.status).to.equal(201);
            expect(res.body.song_id).to.equal("5489e268663534a4148bdfcd");
            api.get('/logout').end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.status).to.equal(302);
                api.post('/login')
                    .send(postdata_dj)
                    .end(function (err, res) {
                        expect(err).to.not.exist;
                        expect(res.status).to.equal(302);
                        var songdata = {
                            message: {
                                currentSong: {
                                    id: "5489e268663534a4148bdfcd",
                                    _id: "5489e268663534a4148bdfcd"
                                }
                            },
                            type: "songplayed"
                        };

                        var first = true;
                        var nClient = require('../lib/notification_client');
                        var data = {
                            eventid: eid
                        };

                        nClient.register_to_event('suggestion_played', function (vote) {
                        }, data);

                        nClient.register_to_event('votes_changed', function (vote) {
                            expect(vote).to.exist;
                            if (first) {
                                expect(vote.song_id._id).to.equal("5489e268663534a4148bdfcd");
                                first = false;
                                done();
                            }
                        }, data);

                        api.post('/eventlog/' + eid).send(songdata).end(function (err, res) {
                            expect(err).to.not.be.ok;
                            expect(res.statusCode).to.equal(201);
                        });
                    });
            });
        });
    });
});