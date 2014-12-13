// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('PlaylistApi', function () {
    this.timeout(10000);

    before(function (done) {
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

            })


    });

    after(function (done) {
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });
    //Logged In
    //#########################################################################################

    it('should return the created playlist of an post request ', function (done) {
        var postdata = {
            "name": "thePlaylist",
            "songs": ['546a5aba06be233f0d93ecde'],
            "owner_id": "546b16fa2e3a10ea162d9355"
        }
        api.post('/playlist').send(postdata).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.contain.key('owner_id');
            expect(res.status).to.equal(201);
            done();
        });
    });

    it('should not return a playlist where i am not the owner of it ', function (done) {
        api.get('/playlist/d3c5ee96b9ce414130AAA').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.be.empty;
            done();
        });
    });
//546d3e88021c21731917fed6
    it('should return status 204 after a successfull delete', function (done) {
        api.delete('/playlist/546d3e88021c21731917fed6').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(204);
            done();
        });
    });


    it('should respond with status 200 and the updated playlist after the update', function (done) {

        var putdata =
        {
            "owner_id": "546b16fa2e3a10ea162d9355",
            "name": 'the new Name!!',
            "_id": "546d3e88021c21731917fed7",
            "songs": ["546d3e88021c21731917ffff"]
        };
        api.put('/playlist').send(putdata).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal('the new Name!!');
            expect(res.body.songs[0]).to.equal("546d3e88021c21731917ffff");
            done();
        });

    });

    it('should  return the  playlist where i am the owner of it ', function (done) {
        api.get('/playlist').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.have.length(2);
            done();
        });
    });

});