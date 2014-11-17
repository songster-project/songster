// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('Test', function () {
    this.timeout(10000);

    it('should login with correct credentials', function (done) {
        var postdata = {
            "username": "admin",
            "password": "admin"
        };
        api.post('/login')
            .send(postdata)
            .expect('Moved Temporarily. Redirecting to /')
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            })
    });
    //Logged In
    //#########################################################################################


    it('should respond with the event when i post a valid event', function (done) {
            var postdata = {
                "name": "myEvent",
                "accessKey" : "theKey",
                "owner_id" : "54638a8a8b5aca5d121cd09c",
                "suggestionEnabled" : "true",
                "votingEnabled" : "true",
                "previewEnabled" : "true"
            }
            api.post('/event').send(postdata).end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.body).to.contain.key('start');
                done();
            })
        }
    );

    it('should throw an error if i create an second event', function (done) {
            var postdata = {
                "name": "myEvent",
                "accessKey" : "theKey",
                "owner_id" : "54638a8a8b5aca5d121cd09c",
                "suggestionEnabled" : "true",
                "votingEnabled" : "true",
                "previewEnabled" : "true"
            }
            api.post('/event').send(postdata).end(function (err, res) {
                console.log(res);
                console.log(err);
                expect(res.error.text).to.equal('This user has already an event running');
                expect(res.error.status).to.equal(400);
                done();
            })
        }
    );

});