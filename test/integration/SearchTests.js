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
        "username": "user3",
        "password": "user3"
    };

    // before all tests create event as user3
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
            "username": "user3",
            "password": "user3"
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
                expect(res.body.hits.hits.length).to.equal(2);
                expect(res.body.hits.hits[0]._id).to.equal('5489e268663534a4148bdfab');
                expect(res.body.hits.hits[1]._id).to.equal('5489e26c663534a4148bdfac');
                expect(err).to.not.exist;
                done();
            });
    });

    it('get artist', function (done) {
        api.get('/search/artist')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.aggregations.artists.buckets.length).to.equal(2);
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event artist get event artists', function (done) {
        api.get('/search/event/' + eid + '/artist')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.aggregations.artists.buckets.length).to.equal(2);
                expect(res.body.aggregations.artists.buckets[0].key).to.equal('Eluveitie');
                expect(res.body.aggregations.artists.buckets[1].key).to.equal('Frankie Rose');
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event artist get event artists with querry', function (done) {
        api.get('/search/event/' + eid + '/artist?q=Glowworm')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.aggregations.artists.buckets.length).to.equal(2);
                expect(res.body.aggregations.artists.buckets[0].key).to.equal('Eluveitie');
                expect(res.body.aggregations.artists.buckets[1].key).to.equal('Frankie Rose');
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event artist should return 400 if event id is no valid mongoid', function (done) {
        api.get('/search/event/zzz/artist')
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event artist should return 400 if event does not exist', function (done) {
        api.get('/search/event/54abb9f6005967151a7aaaaa/artist')
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event song get event songs', function (done) {
        api.get('/search/event/' + eid + '/song')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.hits.hits.length).to.equal(2);
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event song should return 400 if event id is no valid mongoid', function (done) {
        api.get('/search/event/zzz/song')
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event song should return 400 if event does not exist', function (done) {
        api.get('/search/event/54abb9f6005967151a7aaaaa/song')
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event album get event albums', function (done) {
        api.get('/search/event/' + eid + '/album')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.aggregations.albums.buckets.length).to.equal(2);
                expect(res.body.aggregations.albums.buckets[0].key).to.equal('Helvetios');
                expect(res.body.aggregations.albums.buckets[1].key).to.equal('Interstellar');
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event album should return 400 if event id is no valid mongoid', function (done) {
        api.get('/search/event/zzz/album')
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event album should return 400 if event does not exist', function (done) {
        api.get('/search/event/54abb9f6005967151a7aaaaa/album')
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('query song', function (done) {
        api.get('/search/song?q=test')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.hits.hits.length).to.equal(0);
                expect(err).to.not.exist;
                done();
            });
    });

    it('search album should return my albums', function (done) {
        api.get('/search/album')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.aggregations.albums.buckets.length).to.equal(2);
                expect(res.body.aggregations.albums.buckets[0].key).to.equal('Helvetios');
                expect(res.body.aggregations.albums.buckets[1].key).to.equal('Interstellar');
                expect(err).to.not.exist;
                done();
            });
    });

    it('random should return my songs', function (done) {
        api.get('/search/random')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.hits.hits.length).to.equal(2);
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event random get random event songs', function (done) {
        api.get('/search/event/' + eid + '/random')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.hits.hits.length).to.equal(2);
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event random should return 400 if event id is no valid mongoid', function (done) {
        api.get('/search/event/zzz/random')
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('search event random should return 400 if event does not exist', function (done) {
        api.get('/search/event/54abb9f6005967151a7aaaaa/random')
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });
});