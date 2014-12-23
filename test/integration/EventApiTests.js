// our assertion library
var chai = require('chai');
var expect = chai.expect;
// testing framework for our api
var supertest = require('supertest');
var api = supertest.agent('http://localhost:3000');

describe('EventApi', function () {
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

            })


    });

    afterEach(function (done) {
        api.get('/logout').end(function (err, res) {
            expect(err).to.not.exist;
            done();
        });
    });

    //Logged In
    //#########################################################################################

    it('should return no events in the start of the tests', function (done) {

        api.get('/event').end(function (err, res) {
            console.log(res.text);
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
            }
            api.post('/event').send(postdata).end(function (err, res) {
                console.log('Error:' + err);
                console.log(res.text);
                expect(err).to.not.exist;
                expect(res.body).to.contain.key('start');
                eventid = res.body._id;
                done();
            });
        }
    );

    it('should throw an error if i create an second event', function (done) {
        var postdata = {
            "name": "myEvent",
            "accessKey": "theKey",
            "owner_id": "546b16fa2e3a10ea162d9355",
            "suggestionEnabled": true,
            "votingEnabled": true,
            "previewEnabled": true
        }
        api.post('/event').send(postdata).end(function (err, res) {
                api.post('/event').send(postdata).end(function (err, res) {
                    expect(res.error.text).to.equal('This user has already an event running');
                    expect(res.error.status).to.equal(400);
                    done();
                })
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
        }
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

    it('should be able to delete the second past event',function(done){
        api.get('/event/past').end(function (err, res) {
            console.log("HEEERE")
            var eventid = res.body[1]._id
            console.log("eventid!!!: " + eventid);
            api.delete('/event/notactive/'+eventid).end(function(err,res) {
                console.log(err);
               expect(res.status).to.equal(200);
                api.get('/event/past').end(function (err,res){
                    expect(res.body[0]._id).to.not.equal(eventid);
                })
                done();
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
});