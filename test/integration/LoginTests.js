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
            });

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
            });

    });

    it('should get redirected if user is authenticated', function (done) {
        var postdata = {
            "username": "user1",
            "password": "user1"
        };

        api.post('/login')
            .send(postdata)
            .expect(302, 'Moved Temporarily. Redirecting to /')
            .end(function (err, res) {
                expect(err).to.not.exist;
                api.get('/login')
                    .expect(302, 'Moved Temporarily. Redirecting to /app')
                    .end(function (err, res) {
                        expect(err).to.not.exist;
                        done();
                    });
            });

    });

    it('should return 400 if postdata is empty', function (done) {
        var postdata = {};

        api.post('/login')
            .send(postdata)
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });

    });

    it('should display login page at /login', function (done) {
        api.get('/login')
            .expect(200)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
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
            });
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
            });
    });

});