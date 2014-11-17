// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('EventApi', function () {
    this.timeout(10000);

    //Callback - Magic provided by: https://github.com/visionmedia/superagent/issues/314
    //Basically solves that we can be logged in
    beforeEach(function (done) {
        var postdata = {
            "username": "admin",
            "password": "admin"
        };
        var cb = function (x) {
            return;
        };
        api.post('/login')
            .send(postdata)
            .expect('Moved Temporarily. Redirecting to /')
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

    it('should return no events in the start of the tests', function (done) {
        console.log("requesting");
        api.get('/event').end(function (err, res) {
            console.log(res.text);
            expect(err).to.not.exist;
            expect(res.body).to.be.empty;
            done();
        });
    });

    it('should respond with the event when i post a valid event', function (done) {
            var postdata = {
                "name": "myEvent",
                "accessKey": "theKey",
                "owner_id": "54638a8a8b5aca5d121cd09c",
                "suggestionEnabled": true,
                "votingEnabled": true,
                "previewEnabled": true
            }
            api.post('/event').send(postdata).end(function (err, res) {
                console.log('Error:' + err);
                console.log(res.text);
                expect(err).to.not.exist;
                expect(res.body).to.contain.key('start');
                eventid = res.body._id;
                done();
            });
        }
    );

    it('should throw an error if i create an second event', function (done) {
        var postdata = {
            "name": "myEvent",
            "accessKey": "theKey",
            "owner_id": "54638a8a8b5aca5d121cd09c",
            "suggestionEnabled": true,
            "votingEnabled": true,
            "previewEnabled": true
        }
        api.post('/event').send(postdata).end(function (err, res) {
                api.post('/event').send(postdata).end(function (err, res) {
                    expect(res.error.text).to.equal('This user has already an event running');
                    expect(res.error.status).to.equal(400);
                    done();
                })
            }
        );


    });

    it('should show the event as the active event', function (done) {
        api.get('/event/active').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.have.length(1);
            expect(res.body[0].name).to.equal('myEvent');
            done();
        });
    });


    it('should show the event as the current event', function (done) {
        api.get('/event/current').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body.name).to.equal('myEvent');
            done();
        });
    });


    it('should be able to get the current event via id', function (done) {
        api.get('/event/current').end(function (err, res) {

            var id = res.body._id;
            api.get('/event/' + id).end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal('myEvent');
                done();
            });
        });
    });

    it('should set the end date when ending the event', function (done) {
        api.put('/event/current/end').send({}).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body.end).to.not.equal(null);
            done();
        });
    });

});