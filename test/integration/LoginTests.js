// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('Login', function () {
    this.timeout(10000);

   beforeEach(function (done) {
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    afterEach(function (done) {
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    //Logged Out
    //#########################################################################################

    it('should login user1', function (done) {
        console.log('login user1');
        var postdata = {
            "username": "user1",
            "password": "user1"
        };

        api.post('/login')
            .send(postdata)
            .expect(302, 'Moved Temporarily. Redirecting to /')
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            })

    });

    it('should not login user1', function (done) {
        console.log('login user1');
        var postdata = {
            "username": "user1",
            "password": "abc"
        };

        api.post('/login')
            .send(postdata)
            .expect(400).end(function (err, res) {
              expect(err).to.not.exist;
              done();
            })

    });

});