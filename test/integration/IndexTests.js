// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('Index', function () {

    beforeEach(function (done) {
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should redirect to login if not logged in', function (done) {
        api.get('/')
            .expect(302, 'Moved Temporarily. Redirecting to /login')
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('should redirect to app if logged in', function (done) {
        console.log('login user1');
        var postdata = {
            "username": "user1",
            "password": "user1"
        };

        api.post('/login')
            .send(postdata)
            .end(function (err, res) {
                expect(err).to.not.exist;
                api.get('/')
                    .expect(302, 'Moved Temporarily. Redirecting to /app')
                    .end(function (err, res) {
                        expect(err).to.not.exist;
                        done();
                    });
            });

    });
});