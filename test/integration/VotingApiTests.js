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
    //Callback - Magic provided by: https://github.com/visionmedia/superagent/issues/314
    //Basically solves that we can be logged in

    // before all tests create event as user1
    before(function (done) {

        var postdata = {
            "username": "user1",
            "password": "user1"
        };
        var cb = function (x) {
            return;
        };
        api.post('/login')
            .send(postdata)
            .end(function (err) {
                expect(err).to.not.exist;

                // create event as user1
                api.get('/event').end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.body).to.be.empty;
                    var postdata = {
                        "name": "votingEvent1",
                        "accessKey": "theKey",
                        "owner_id": "546b16fa2e3a10ea162d9355",
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

    // close event and logout user
    after(function (done) {
        api.put('/event/current/end').send({}).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body.end).to.not.equal(null);

            api.get('/logout').end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });

        });
    });

//Logged In
//#########################################################################################


    it('should post one vote', function (done) {
        var postdata = {
            "type": "vote",
            "state": "new",
            "song_id": "5489e26c663534a4148bdfce",
            "event_id": eid
        }

        api.post('/voting/' + eid).send(postdata).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            expect(res.body).to.contain.key('date');
            expect(res.status).to.equal(201);
            done();
        });
    });

    it('should not post vote for same song twice', function (done) {
        var postdata = {
            "type": "vote",
            "state": "new",
            "song_id": "5489e26c663534a4148bdfce",
            "event_id": eid
        }

        api.post('/voting/' + eid).send(postdata).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            done();
        });
    });

    it('should return one vote for song', function (done) {
        api.get('/voting/votedsongs/' + eid).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(200);
            expect(res.body[0].song_id._id).to.equal("5489e26c663534a4148bdfce");
            done();
        });
    });

    it('should return one client vote for song', function (done) {
        api.get('/voting/uservotes/' + eid).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(200);
            expect(res.body[0].song_id._id).to.equal("5489e26c663534a4148bdfce");
            done();
        });
    });

    it('should redirect voting of anonymous user and vote', function(done) {
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;

            api.get('/voting/'+ eid).end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.text).to.contain('Moved Temporarily');
                console.log(res.text);

                var postdata = {
                    "type": "vote",
                    "state": "new",
                    "song_id": "5489e26c663534a4148bdfce",
                    "event_id": eid
                }

                api.post('/voting/' + eid).send(postdata).end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.status).to.equal(201);
                    done();
                });
            });

        });
    });

    it('should return two votes for song', function (done) {
        api.get('/voting/votedsongs/' + eid).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(200);
            expect(res.body[0].song_id._id).to.equal("5489e26c663534a4148bdfce");
            expect(res.body[1].song_id._id).to.equal("5489e26c663534a4148bdfce");
            done();
        });
    });

    it('should get vote via websocket from anonymous users vote ', function (done) {

        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;

            // call voting as unlogged - get logged in as anonymous
            api.get('/voting/'+ eid).end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.text).to.contain('Moved Temporarily');
                console.log(res.text);

                var postdata = {
                    "type": "vote",
                    "state": "new",
                    "song_id": "5489e268663534a4148bdfcd",
                    "event_id": eid
                }

                var first = true;
                var nClient = require('../lib/notification_client');
                var data = {
                    eventid: eid
                };

                nClient.register_to_event('votes_changed', function (vote) {
                    expect(vote).to.exist;
                    if (first) {
                        expect(vote.song_id._id).to.equal("5489e268663534a4148bdfcd");
                        first = false;
                        done();
                    }
                }, data);

                api.post('/voting/' + eid).send(postdata).end(function (err, res) {
                    // nothing to check - this will do the websocket callback
                });
            });

        });
    });


});