// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('Accounts', function () {
    this.timeout(10000);

    beforeEach(function (done) {
        var postdata = {
            "username": "user2",
            "password": "user2"
        };
        var cb = function (x) {
            return;
        };
        api.post('/login')
            .send(postdata)
            .end(function (err) {
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

    it('should get account', function (done) {
        api.get('/account')
            .expect(200)
            .end(function (err, res) {
                //console.log(res);
                expect(err).to.not.exist;
                expect(res.text).to.contain("5489e22a2b6671a414dcab8f");
                done();
            });
    });

    it('should get account id', function (done) {
        api.get('/account/id')
            .expect(200)
            .end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.body.id).to.equal("5489e22a2b6671a414dcab8f");
                done();
            });
    });

    it('should get account info', function (done) {
        api.get('/account/info')
            .expect(200)
            .end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.body._id).to.equal("5489e22a2b6671a414dcab8f");
                done();
            });
    });
});