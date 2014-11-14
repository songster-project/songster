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
            .expect('<!DOCTYPE html><html><head><title></title><link rel="stylesheet" href="/stylesheets/style.css"></head><body><h1>Songster</h1><p><a href="login">Login</a></p><p><a href="logout">Logout</a></p><p><a href="account">Account (needs to be logged in)</a></p><h1>Please login</h1><form method="post"><label>Username</label><input type="text" name="username" id="username"><label>Password</label><input type="password" name="password" id="password"><button type="submit">Sign In</button></form></body></html>')
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
            .expect('Moved Temporarily. Redirecting to /login')
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            })
    });
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
    it('should display songs', function (done) {
        api.get('/song')
            .expect('[{"addedDate":"2014-11-13T17:29:02.493Z","title":"Meet The Enemy","artist":"Eluveitie","album":"Helvetios","year":"","comment":"","track":0,"genre":255,"file_id":"5464ea5e516bfe3a06661698","_id":"5464ea5e815d523a069555c0"}]')
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            })
    });
});