// our assertion library
var chai = require('chai');
var expect = chai.expect;

// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('Test', function () {
    this.timeout(10000);

    it('should display login page at /login', function (done) {
        api.get('/login')
            .expect(200)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            })
    });
    it('login should not work with wrong credentials', function (done) {
        var postdata = {
            "username": "admin",
            "password": "asdf"
        };
        api.post('/login')
            .send(postdata)
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            })
    });
    it('should login with correct credentials', function (done) {
        var postdata = {
            "username": "user1",
            "password": "user1"
        };
        api.post('/login')
            .send(postdata)
            .expect(302)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            })
    });
});