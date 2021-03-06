// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('EventLog', function () {
    this.timeout(10000);

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

    it('should return the songs of the event', function (done) {

        api.get('/eventlog/songs/548eb4134bb971760975bcba').end(function (err, res) {
            console.log(res.body);
            expect(res.body).to.not.be.empty;
            expect(res.body).to.have.length(2);
            console.log(res.body[0]);
            expect(res.body[0].message).to.exist;
            expect(res.body[0].logDate).to.equal('2014-12-15T14:39:00.054Z');
            console.log(res.body[0].message);
            expect(res.body[0].message.currentSong.title).to.equal('Money (That\'s What I Want)');
            done();
        });
    });

    it('votes should send vote if id is valid', function (done) {
        api.get('/eventlog/votes/548eb4134bb971760975bcba').expect(200).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.body).to.have.length(0);
            done();
        });
    });

    it('votes should send 400 if not valid mongoid', function (done) {
        api.get('/eventlog/votes/___').expect(400).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.body).to.be.empty;
            done();
        });
    });

    it('suggestions should send suggestions if id is valid', function (done) {
        api.get('/eventlog/suggestions/548eb4134bb971760975bcba').expect(200).end(function (err, res) {
            expect(err).to.not.be.ok;
            expect(res.body).to.have.length(0);
            done();
        });
    });

    it('suggestions should send 400 if id is not valid mongoid', function (done) {
        api.get('/eventlog/suggestions/zzzzz').expect(400).end(function (err, res) {
            expect(err).to.not.be.ok;
            done();
        });
    });
});