// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('UrlShortening', function () {
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

    it('should return an error when i request without q parameter',function(done){
        api.get('/event/shorten').end(function (err, res) {
            expect(res.status).to.equal(400);
            //Check exception message
            expect(res.text.indexOf('param: \'q\'')).to.be.greaterThan(-1);
            expect(res.text.indexOf('no url to shorten defined in the q get parameter')).to.be.greaterThan(-1);;
            done();
        });
    });

    it('should return an error when i request with a q that is not an uri',function(done){
        api.get('/event/shorten?q=notAnUri').end(function (err, res) {
            console.log(res.text);
            expect(res.status).to.equal(400);
            expect(res.text.indexOf('param: \'q\'')).to.be.greaterThan(-1);
            expect(res.text.indexOf('Parameter is not a valid url')).to.be.greaterThan(-1);;
            done();
        });
    });

    it('should return no error and the url when i make a valid request',function(done){
        api.get('/event/shorten?q=http://www.test.com').end(function (err, res) {
            expect(res.body.url).to.exist;
            expect(res.body.url.indexOf('http://bit.ly/')).to.equal(0);
            done();
        });
    });

    it('should return same url when i make a valid request for a url i already shortened',function(done){
        api.get('/event/shorten?q=http://www.gmx.at').end(function (err, res) {
            var short;
            expect(res.body.url).to.exist;
            expect(res.body.url.indexOf('http://bit.ly/')).to.equal(0);
            short=res.body.url;
            api.get('/event/shorten?q=http://www.gmx.at').end(function (err, res) {
                expect(res.body.url).to.exist;
                expect(res.body.url.indexOf('http://bit.ly/')).to.equal(0);
                expect(res.body.url).to.equal(short);
                done();
            });
        });
    });
});