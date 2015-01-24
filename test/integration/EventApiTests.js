// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('EventApi', function () {
    this.timeout(10000);
    var id_event;

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

    it('should show no event als current if i have no open event', function (done) {
        api.get('/event/current').expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.be.empty;
            done();
        });
    });

    it('should show no event if i have no past events', function (done) {
        api.get('/event/past').expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.be.empty;
            done();
        });
    });

    it('should return no events when i have not closed an event',function(done){
        api.get('/event/past').end(function (err, res) {
            console.log(res.text);
            expect(err).to.not.exist;
            expect(res.body).to.have.length(0);
            done();
        });
    });

    it('should respond with the event when i post a valid event', function (done) {
            var postdata = {
                "name": "myEvent",
                "accessKey": "theKey",
                "owner_id": "546b16fa2e3a10ea162d9355",
                "suggestionEnabled": true,
                "votingEnabled": true,
                "previewEnabled": true
            };

            api.post('/event').send(postdata).end(function (err, res) {
                console.log('Error:' + err);
                console.log(res.text);
                expect(err).to.not.exist;
                expect(res.body).to.contain.key('start');
                id_event = res.body._id;
                done();
            });
        });

    it('should throw an error if i create an second event', function (done) {
        var postdata = {
            "name": "myEvent",
            "accessKey": "theKey",
            "owner_id": "546b16fa2e3a10ea162d9355",
            "suggestionEnabled": true,
            "votingEnabled": true,
            "previewEnabled": true
        };

        api.post('/event').send(postdata).end(function (err, res) {
                api.post('/event').send(postdata).end(function (err, res) {
                    expect(res.error.text).to.equal('This user has already an event running');
                    expect(res.error.status).to.equal(400);
                    done();
                });
            }
        );
    });

    it('should show the event as the active event', function (done) {
        api.get('/event/active').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.have.length(1);
            expect(res.body[0].name).to.equal('myEvent');
            done();
        });
    });

    it('should show the event as the current event', function (done) {
        api.get('/event/current').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body.name).to.equal('myEvent');
            done();
        });
    });

    it('should be able to get the current event via id', function (done) {
        api.get('/event/current').end(function (err, res) {
            var id = res.body._id;
            api.get('/event/' + id).end(function (err, res) {
                expect(err).to.not.exist;
                expect(res.body.name).to.equal('myEvent');
                done();
            });
        });
    });

    it('should return 204 when i want to delete the current active event',function(done){
        api.get('/event/current').end(function (err, res) {
            var id = res.body._id;
            api.delete('/event/notactive/'+id).end(function (err,res) {
                expect(res.status).to.equal(204);
                done();
            });
        });
    });

    it('should set the end date when ending the event', function (done) {
        api.put('/event/current/end').send({}).end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body.end).to.not.equal(null);
            done();
        });
    });

    it('should return the closed event as a past event',function(done){
        api.get('/event/past').end(function (err, res) {
            console.log(res.text);
            expect(err).to.not.exist;
            expect(res.body).to.have.length(1);
            done();
        });
    });

    it('should return two events after start and end a next one',function(done){
        var postdata = {
            "name": "myEvent",
            "accessKey": "theKey",
            "owner_id": "546b16fa2e3a10ea162d9355",
            "suggestionEnabled": true,
            "votingEnabled": true,
            "previewEnabled": true
        };

        api.post('/event').send(postdata).end(function (err, res) {
                api.put('/event/current/end').send({}).end(function (err, res) {
                    api.get('/event/past').end(function (err, res) {
                        console.log(res.text);
                        expect(err).to.not.exist;
                        expect(res.body).to.have.length(2);
                        done();
                    });
                });
            }
        );
    });

    it('should return the events descending to their start date',function(done){
        api.get('/event/past').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.have.length(2);
            expect(res.body[0].start).to.be.greaterThan(res.body[1].start);
            done();
        });
    });

    it('should be able to delete the second past event and get should not show it',function(done){
        api.get('/event/past').end(function (err, res) {
            var eventid = res.body[1]._id;
            api.delete('/event/notactive/'+eventid).end(function(err,res) {
               expect(res.status).to.equal(200);
                api.get('/event/past').end(function (err,res){
                    expect(res.body[0]._id).to.not.equal(eventid);
                    api.get('/event/'+eventid).end(function (err,res){
                        expect(res.status).to.equal(404);
                        done();
                    });
                });
            });
        });
    });

    it('should now return only one past event',function(done){
        api.get('/event/past').end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.have.length(1);
            done();
        });
    });

    it('should return 400 if parameter is missing', function (done) {
        api.get('/event/qr').expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should return 400 if parameter is not a valid url', function (done) {
        api.get('/event/qr?q=test').expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should return 200 if valid url', function (done) {
        api.get('/event/qr?q=https%3A%2F%2Fwww.youtube.com%2F').expect(200).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should return 400 with not valid mongo id', function (done) {
        api.get('/event/zzz').expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should send 404 if i want to end the current event and no event is active', function (done) {
        api.put('/event/current/end').expect(404).send({}).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should send 400 if post data is not valid on event creation', function (done) {
        api.post('/event/').expect(400).send({}).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should send 400 i want to delete a event with not valid mongoid', function (done) {
        api.delete('/event/notactive/zzz').expect(400).end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });
});