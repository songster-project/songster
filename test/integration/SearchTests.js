// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('SearchApi', function () {
    this.timeout(10000);
    var eid;

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
                        "name": "searchEvent1",
                        "accessKey": "theKey",
                        "owner_id": "5489e22a2b6671a414dcab8f",
                        "suggestionEnabled": true,
                        "votingEnabled": true,
                        "previewEnabled": true
                    };
                    api.post('/event').send(postdata).expect(201).end(function (err, res) {
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

    it('get all songs', function (done) {
        api.get('/search/song')
            .expect(200)
            .end(function (err, res) {
                console.log('####________####');
                console.log(res.body);
                expect(err).to.not.exist;
                done();
            });
    });

    it('get artists', function (done) {
        api.get('/search/artist')
            .expect(200)
            .end(function (err, res) {
                console.log('####________####');
                console.log(res.body);
                expect(err).to.not.exist;
                done();
            });
    });

    it('get event artists', function (done) {
        api.get('/search/event/' + eid + '/artist')
            .expect(200)
            .end(function (err, res) {
                console.log('####________####');
                console.log(res.body);
                expect(err).to.not.exist;
                done();
            });
    });

    it('get event songs', function (done) {
        api.get('/search/event/' + eid + '/song')
            .expect(200)
            .end(function (err, res) {
                console.log('####________####');
                console.log(res.body);
                expect(err).to.not.exist;
                done();
            });
    });
});