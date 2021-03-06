// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('SongApi', function () {
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

    it('should return my songs', function (done) {
        api.put('/event/current/end').send({}).end(function (err, res) {
            api.get('/song')
                .expect(200)
                .end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.body.length).to.equal(3);
                    expect(res.body[0]._id).to.equal('5489e267663534a4148bdfcc');
                    expect(res.body[1]._id).to.equal('5489e268663534a4148bdfcd');
                    expect(res.body[2]._id).to.equal('5489e26c663534a4148bdfce');
                    done();
                });
        });
    });

    it('should delete song', function (done) {
        api.delete('/song/5489e26c663534a4148bdfce')
            .expect(204)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('delete should not work if there is no song with this id', function (done) {
        api.delete('/song/aaa')
            .expect(500)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('get cover should not work if there is no song with this id', function (done) {
        api.get('/song/aaaa/cover')
            .expect(500)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('should not work with invalid song id', function (done) {
        api.get('/song/aa_aa/cover')
            .expect(500)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('should not get cover of song from different user', function (done) {
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;
            var postdata = {
                "username": "user1",
                "password": "user1"
            };

            api.post('/login')
                .send(postdata)
                .expect(302, 'Moved Temporarily. Redirecting to /')
                .end(function (err, res) {
                    expect(err).to.not.exist;
                    api.get('/song/5489e2682b6671a414dcab9c/cover')
                        .expect(401)
                        .end(function (err, res) {
                            expect(err).to.not.exist;
                            done();
                        });
                });
        });
    });

    it('get raw should not work if there is no song with this id', function (done) {
        api.get('/song/aaaa/raw')
            .expect(500)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('should not get cover of song from different user', function (done) {
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;
            var postdata = {
                "username": "user1",
                "password": "user1"
            };

            api.post('/login')
                .send(postdata)
                .expect(302, 'Moved Temporarily. Redirecting to /')
                .end(function (err, res) {
                    expect(err).to.not.exist;
                    api.get('/song/5489e2612b6671a414dcab94/cover')
                        .expect(401)
                        .end(function (err, res) {
                            expect(err).to.not.exist;
                            done();
                        });
                });
        });
    });

    it('get raw should not work if id is not valid', function (done) {
        api.get('/song/%25%24§"23ed/raw')
            .expect(500)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('get song with not valid id', function (done) {
        api.get('/song/5489e2612b6671a414dcab9_')
            .expect(500)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('save song should return 400 if post data is empty', function (done) {
        api.post('/song/')
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('updateCover should return 400 if put data is empty', function (done) {
        api.put('/song/zzz/updateCover')
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('put song should return 400 if id is not valid', function (done) {
        api.put('/song/zzz')
            .expect(400)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });

    it('put song should return 404 if there is no song with the id', function (done) {
        var putdata = {
            _id: '54abb9f6005967151a7aaaaa'
        };
        api.put('/song/54abb9f6005967151a7aaaaa')
            .expect(404)
            .send(putdata)
            .end(function (err, res) {
                expect(err).to.not.exist;
                done();
            });
    });
});