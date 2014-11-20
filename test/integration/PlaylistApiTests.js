// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('PlaylistApi', function () {
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

    it('should return the created event of an post request ', function (done) {
        var postdata = {
            "name": "thePlaylist",
            "songs" : ['546a5aba06be233f0d93ecde'],
            "owner_id" : "54638a8a8b5aca5d121cd09c"
        }
        api.post('/playlist').send(postdata).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.contain.key('owner_id');
            expect(res.status).to.equal(201);
            done();
        });
    });
});