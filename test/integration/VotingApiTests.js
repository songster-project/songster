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


    it('should post one vote', function (done) {
        var postdata = {
            "type": "vote",
            "state": "new",
            "song_id": "5489e268663534a4148bdfab",
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
            "song_id": "5489e268663534a4148bdfab",
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
            expect(res.body[0].song_id._id).to.equal("5489e268663534a4148bdfab");
            done();
        });
    });

    it('should return one client vote for song', function (done) {
        api.get('/voting/uservotes/' + eid).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(200);
            expect(res.body[0].song_id._id).to.equal("5489e268663534a4148bdfab");
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
                    "song_id": "5489e268663534a4148bdfab",
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
            expect(res.body[0].song_id._id).to.equal("5489e268663534a4148bdfab");
            expect(res.body[1].song_id._id).to.equal("5489e268663534a4148bdfab");
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
                    "song_id": "5489e268663534a4148bdfab",
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
                        expect(vote.song_id._id).to.equal("5489e268663534a4148bdfab");
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

    it('votedsongs should return 400 if eventid is not a valid mongoid', function (done) {
        api.get('/voting/votedsongs/zzz').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            done();
        });
    });

    it('votedsongs should return 400 if there is no event with the id', function (done) {
        api.get('/voting/votedsongs/aaaaaaaaaaaaaaaaaaaaaaaa').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            done();
        });
    });

    it('uservotes should return 400 if eventid is not a valid mongoid', function (done) {
        api.get('/voting/uservotes/zzz').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            done();
        });
    });

    it('uservotes should return 400 if there is no event with the id', function (done) {
        api.get('/voting/uservotes/aaaaaaaaaaaaaaaaaaaaaaaa').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            done();
        });
    });

    it('usersuggestions should return 400 if eventid is not a valid mongoid', function (done) {
        api.get('/voting/usersuggestions/zzz').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            done();
        });
    });

    it('usersuggestions should return 400 if there is no event with the id', function (done) {
        api.get('/voting/usersuggestions/aaaaaaaaaaaaaaaaaaaaaaaa').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            done();
        });
    });

    it('post vote should return 400 if eventid is not a valid mongoid', function (done) {
        var postdata = {
            "type": "suggestion",
            "state": "new",
            "song_id": "5489e268663534a4148bdfab",
            "event_id": eid
        }

        api.post('/voting/zzz').send(postdata).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            done();
        });
    });

    it('post vote should return 400 if there is no event with the id', function (done) {
        var postdata = {
            "type": "suggestion",
            "state": "new",
            "song_id": "5489e268663534a4148bdfab",
            "event_id": eid,
            "suggestion_type": 'file'
        }

        api.post('/voting/54abb9f6005967151a7aaaaa').send(postdata).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            done();
        });
    });

    it('post vote should return 400 if there is no song with the id', function (done) {
        var postdata = {
            "type": "suggestion",
            "state": "new",
            "song_id": "54abb9f6005967151a7aaaaa",
            "event_id": eid,
            "suggestion_type": 'file'
        }

        api.post('/voting/' + eid).send(postdata).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            done();
        });
    });

    it('usersuggestions should return 200 if valid event and empty response', function (done) {
        api.get('/voting/usersuggestions/' + eid).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(0);
            done();
        });
    });

    it('post vote should add suggestion of own song', function (done) {
        var postdata = {
            "type": "suggestion",
            "state": "new",
            "song_id": "5489e267663534a4148bdfcc",
            "event_id": eid,
            "suggestion_type": 'file'
        }

        api.post('/voting/'+eid).send(postdata).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            expect(res.status).to.equal(201);
            expect(res.body.song_id).to.equal("5489e267663534a4148bdfcc");
            done();
        });
    });

    it('usersuggestions should return 200 if valid event and send suggestions', function (done) {
        api.get('/voting/usersuggestions/' + eid).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(200);
            expect(res.body[0].song_id._id).to.equal("5489e267663534a4148bdfcc");
            done();
        });
    });

    it('post vote should return 400 if youtube suggestion and no youtubeid', function (done) {
        var postdata = {
            "type": "suggestion",
            "state": "new",
            "song_id": "54abb9f6005967151a7aaaaa",
            "event_id": eid,
            "suggestion_type": 'youtube'
        }

        api.post('/voting/' + eid).send(postdata).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            done();
        });
    });

    it('post vote should return 400 if youtube suggestion and no youtubeid', function (done) {
        var postdata = {
            "type": "suggestion",
            "state": "new",
            "song_id": "54abb9f6005967151a7aaaaa",
            "event_id": eid,
            "suggestion_type": 'youtube'
        }

        api.post('/voting/' + eid).send(postdata).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            done();
        });
    });

    it('get vote should redirect to event vote page', function (done) {
        api.get('/voting/' + eid).expect(302,'Moved Temporarily. Redirecting to /app/#/event/'+eid).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            done();
        });
    });

    it('get vote should return 500 if not valid mongoid', function (done) {
        api.get('/voting/zzz').expect(500).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            done();
        });
    });

    it('get vote should return 400 if there is no event with the id', function (done) {
        api.get('/voting/54abb9f6005967151a7aaaaa').expect(400).end(function (err, res) {
            console.log('Error: ' + err);
            expect(err).to.not.exist;
            done();
        });
    });
});