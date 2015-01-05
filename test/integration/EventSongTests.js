// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');
var database = require('../lib/database');

describe('EventSong', function () {
    var eid;
    this.timeout(10000);

    var postdata_dj = {
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
                        "owner_id": "5489e22a2b6671a414dcab8f",
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
            .send(postdata_dj)
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

    it('get raw should get song, range request', function (done) {
        var range = '1-2';
        api.get('/song/5489e2612b6671a414dcab94/raw')
            .expect(206)
            .set('range', range)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('get raw should not work if id is not valid', function (done) {
        api.get('/song/zzz/raw')
            .expect(500)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('get raw from different user', function (done) {
        api.get('/song/5489e26c663534a4148bdfac/raw')
            .expect(401)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('get song with valid id', function (done) {
        api.get('/song/5489e2612b6671a414dcab94')
            .expect(200)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('get song with not valid id', function (done) {
        api.get('/song/zzz')
            .expect(500)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('get song from different user', function (done) {
        api.get('/song/5489e26c663534a4148bdfac')
            .expect(200)
            .end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.body).to.be.empty;
                done();
            });
    });

    it('get cover should get cover of song', function (done) {
        api.get('/song/5489e2682b6671a414dcab9c/cover')
            .expect(200)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('get cover should get cover of song not valid id', function (done) {
        api.get('/song/zzz/cover')
            .expect(500)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('get song cover from different user', function (done) {
        api.get('/song/5489e26c663534a4148bdfac/cover')
            .expect(401)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });
});