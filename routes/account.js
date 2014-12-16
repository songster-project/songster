var express = require('express');
var router = express.Router();
var passport = require('../config/passport');

//PS: avoids 304 in this module
//Problem occurs when i want to request the /id, and it doesn't change
router.get('/*', function(req, res, next){
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
});

router.get('/', passport.ensureAuthenticated, function (req, res) {
    res.render('account', { id: req.session.passport.user });
});

router.get('/info',passport.ensureAuthenticated, function (req, res){
    var user = req.user;
    user.salt = undefined;
    user.password = undefined;
    res.send(user);
});

router.get('/id', passport.ensureAuthenticated, passport.ensureNotAnonymous, function (req, res) {
    res.status(200).send({id: req.session.passport.user});
});

module.exports = router;
