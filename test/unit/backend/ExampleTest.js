// our assertion library
var chai = require('chai');
// sinon integration for chai
var sinonChai = require("sinon-chai");
// sinon is a spy, stub, and mocking framework for javascript
var sinon = require("sinon");
chai.use(sinonChai);
var expect = chai.expect;


describe('Test', function () {
    it('ensureAuthenticated calls next if user is authenticated', function () {
        var pass = require('./../../../config/passport');
        var req = {
            isAuthenticated: function () {
                return true;
            }
        };
        var res = {};
        res.redirect = function () {
        };
        var next = sinon.spy();
        pass.ensureAuthenticated(req, res, next);
        expect(next).to.have.been.called;
    })
})
