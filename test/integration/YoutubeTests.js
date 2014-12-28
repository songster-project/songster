// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');
var database = require('../lib/database');

describe('YoutubeApi', function () {
    this.timeout(60000);

    //Callback - Magic provided by: https://github.com/visionmedia/superagent/issues/314
    //Basically solves that we can be logged in
    beforeEach(function (done) {
        var postdata = {
            "username": "user1",
            "password": "user1"
        };
        var cb = function (x) {
            return;
        };
        api.post('/login')
            .send(postdata)
            .expect(302)
            .end(function (err, res) {
                expect(err).to.not.exist;

                process.nextTick(function () {
                    cb(err);
                });
                done();
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

    //tests for song upload
    it('upload should return 302 if not logged in', function (done) {
        var postdata = {
            youtubeurl: 'https://www.youtube.com/watch?v=he2a4xK8ctk'
        };
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;
            api.get('/logout').end(function (err, res) {
                expect(err).to.not.exist;
                api.post('/youtube').send(postdata).expect(302, 'Moved Temporarily. Redirecting to /login').end(function (err, res) {
                    expect(err).to.not.exist;
                    done();
                });
            });
        });
    });

    it('upload should work with youtube playlist link', function (done) {
        var postdata = {
            youtubeurl: 'https://www.youtube.com/watch?v=svt6MTmTAKQ&index=14&list=PL54856EB4DCF67FD6'
        };
        api.post('/youtube').send(postdata).expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            database.Song.findOne({
                owner_id: '546b16fa2e3a10ea162d9355',
                title: 'BBC Weatherman Finger Fail'
            }, function (err, song) {
                expect(err).to.not.exist;
                expect(song).to.exist;
                done();
            });
        });
    });

    it('upload should load youtube song with direct link', function (done) {
        var postdata = {
            youtubeurl: 'https://www.youtube.com/watch?v=he2a4xK8ctk'
        };
        api.post('/youtube').send(postdata).expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            database.Song.findOne({
                owner_id: '546b16fa2e3a10ea162d9355',
                title: 'Fox 5 JetPack FAIL'
            }, function (err, song) {
                expect(err).to.not.exist;
                expect(song).to.exist;
                done();
            });
        });
    });

    it('upload should upload youtube song again even if already uploaded', function (done) {
        var postdata = {
            youtubeurl: 'https://www.youtube.com/watch?v=he2a4xK8ctk'
        };
        api.post('/youtube').send(postdata).expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            database.Song.find({
                owner_id: '546b16fa2e3a10ea162d9355',
                title: 'Fox 5 JetPack FAIL'
            }, function (err, song) {
                expect(err).to.not.exist;
                expect(song.length).to.equal(2);
                done();
            });
        });
    });

    it('upload should load youtube song with video link and additional data', function (done) {
        var postdata = {
            youtubeurl: 'https://www.youtube.com/watch?v=ZZbIx7xy5mc&index=16&list=PL54856EB4DCF67FD6',
            data: 'testdata'
        };
        api.post('/youtube').send(postdata).expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            database.Song.findOne({
                owner_id: '546b16fa2e3a10ea162d9355',
                title: 'Camel interrupts Interview'
            }, function (err, song) {
                expect(err).to.not.exist;
                expect(song).to.exist;
                done();
            });
        });
    });

    it('upload should send 500 with not youtube url', function (done) {
        var postdata = {
            youtubeurl: 'http://derstandard.at/'
        };
        api.post('/youtube').send(postdata).expect(500).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('upload should send 400 if youtube url is missing in post request', function (done) {
        var postdata = {};
        api.post('/youtube').send(postdata).expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('upload should send 400 if youtube url is missing in post request but with other set fields', function (done) {
        var postdata = {
            data: 'testdata'
        };
        api.post('/youtube').send(postdata).expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('upload should send 400 if post data is missing', function (done) {
        api.post('/youtube').expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    //tests for search
    it('search should send 400 if search data is missing', function (done) {
        api.get('/youtube/search').expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('search should send 200 with search result on correct search', function (done) {
        api.get('/youtube/search?q=Highway+to+hell').expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.contain.key('result');
            expect(res.body.result).to.have.length(5);
            expect(res.body.result[0]).to.contain.key('title');
            expect(res.body.result[0]).to.contain.key('channelTitle');
            expect(res.body.result[0]).to.contain.key('videoId');
            done();
        });
    });

    it('search should send 200 with empty request if no results are found', function (done) {
        api.get('/youtube/search?q=rfedcxesdxcrefadycx').expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.contain.key('result');
            expect(res.body.result).to.have.length(0);
            done();
        });
    });

    it('search should work with empty querry', function (done) {
        api.get('/youtube/search?q=').expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.contain.key('result');
            expect(res.body.result).to.have.length(5);
            expect(res.body.result[0]).to.contain.key('title');
            expect(res.body.result[0]).to.contain.key('channelTitle');
            expect(res.body.result[0]).to.contain.key('videoId');
            done();
        });
    });

    it('search should work with num Results and querry parameter', function (done) {
        api.get('/youtube/search?q=test&numResults=10').expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.contain.key('result');
            expect(res.body.result).to.have.length(10);
            done();
        });
    });

    it('search should work with direct video link', function (done) {
        api.get('/youtube/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D2QZ47h4fVTU').expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.contain.key('result');
            expect(res.body.result[0]).to.contain.key('title');
            expect(res.body.result[0].title).to.equal('AIRBOURNE - No Way But The Hard Way (Official Music Video)');
            expect(res.body.result[0]).to.contain.key('channelTitle');
            expect(res.body.result[0].channelTitle).to.equal('roadrunnergermany');
            expect(res.body.result[0]).to.contain.key('videoId');
            expect(res.body.result[0].videoId).to.equal('2QZ47h4fVTU');
            done();
        });
    });

    it('search should work with direct videoid', function (done) {
        api.get('/youtube/search?q=2QZ47h4fVTU').expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.contain.key('result');
            expect(res.body.result[0]).to.contain.key('title');
            expect(res.body.result[0].title).to.equal('AIRBOURNE - No Way But The Hard Way (Official Music Video)');
            expect(res.body.result[0]).to.contain.key('channelTitle');
            expect(res.body.result[0].channelTitle).to.equal('roadrunnergermany');
            expect(res.body.result[0]).to.contain.key('videoId');
            expect(res.body.result[0].videoId).to.equal('2QZ47h4fVTU');
            done();
        });
    });
});