// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('Registration', function () {
    this.timeout(10000);

    beforeEach(function (done) {

        var cb = function (x) {
            return;
        };

        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;

            process.nextTick(function () {
                cb(err);
                done();
            });

        });
    });

    afterEach(function (done) {

        var cb = function (x) {
            return;
        };

        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;

            process.nextTick(function () {
                cb(err);
                done();
            });

        });
    });

    //Logged Out
    //#########################################################################################

    it('should registrate user', function (done) {
        console.log("registrating");

        var postdata = {
            "username": "testuser1",
            "password": 'testuser1',
            "confirm_password": 'testuser1',
            "first_name": "first",
            "last_name": "last",
            "email": "testuser1@test.at"
        };

        api.post('/registration').send(postdata).expect(302, 'Moved Temporarily. Redirecting to /').end(function (err, res) {
            expect(err).to.not.exist;
           done();

        });

    });

    it('should not registrate user due to missing confirm_password', function (done) {
        console.log("missing confirm_password");

        var postdata = {
            "username": "testuser2",
            "password": 'testuser2',
            "first_name": "first",
            "last_name": "last",
            "email": "testuser2@test.at"
        };

        api.post('/registration').send(postdata).expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });

    });

    it('should not registrate user due to missing username', function (done) {
        console.log("missing username");

        var postdata = {
            "password": 'testuser2',
            "confirm_password": 'testuser2',
            "first_name": "first",
            "last_name": "last",
            "email": "testuser2@test.at"
        };

        api.post('/registration').send(postdata).expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });

    });

    it('should not registrate user due to missing first_name', function (done) {
        console.log("missing first_name");

        var postdata = {
            "username": "testuser2",
            "password": 'testuser2',
            "confirm_password": 'testuser2',
            "last_name": "last",
            "email": "testuser2@test.at"
        };

        api.post('/registration').send(postdata).expect(400).end(function (err, res) {
           expect(err).to.not.exist;
            done();
        });

    });

    it('should not registrate user due to missing last_name', function (done) {
        console.log("missing last_name");

        var postdata = {
            "username": "testuser2",
            "password": 'testuser2',
            "confirm_password": 'testuser2',
            "first_name": "first",
            "email": "testuser2@test.at"
        };

        api.post('/registration').send(postdata).expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });

    });

    it('should not registrate user due to missing email', function (done) {
        console.log("missing email");

        var postdata = {
            "username": "testuser2",
            "password": 'testuser2',
            "confirm_password": 'testuser2',
            "first_name": "first",
            "last_name": "last"
        };

        api.post('/registration').send(postdata).expect(400).end(function (err, res) {
           expect(err).to.not.exist;
            done();
        });

    });

    it('should not registrate user due to invalid email', function (done) {
        console.log("invalid email");

        var postdata = {
            "username": "testuser2",
            "password": 'testuser2',
            "confirm_password": 'testuser2',
            "first_name": "first",
            "last_name": "last",
            "email": 'invalid_mail'
        };

        api.post('/registration').send(postdata).expect(400).end(function (err, res) {
           expect(err).to.not.exist;
            done();
        });

    });

    it('should not registrate user because password and confirm_password are not equal', function (done) {
        console.log("pw and confirm_pw not equal");

        var postdata = {
            "username": "testuser2",
            "password": 'testuser2',
            "confirm_password": 'testuser3',
            "first_name": "first",
            "last_name": "last",
            "email": "testuser2@test.at"
        };

        api.post('/registration').send(postdata).expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });

    });

    it('should not registrate user due to already existed username', function (done) {
        console.log("existing username");

        var postdata = {
            "username": "user1",
            "password": 'testuser2',
            "confirm_password": 'testuser2',
            "first_name": "first",
            "last_name": "last",
            "email": "testuser2@test.at"
        };

        api.post('/registration').send(postdata).expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });

    });

    it('should redirect to registration if not authenticated', function (done) {
        api.get('/registration').expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.text).to.contain('Songster - Registration');
            done();
        });
    });

    it('should redirect to app if logged in', function (done) {
        var logindata = {
            "username": "user2",
            "password": "user2"
        };
        api.post('/login')
            .send(logindata)
            .end(function (err, res) {
                api.get('/registration').expect(302, 'Moved Temporarily. Redirecting to /app').end(function (err, res) {
                    expect(err).to.not.exist;
                    done();
                });
            });
    });

});