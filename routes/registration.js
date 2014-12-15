var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var crypto = require('crypto');
var db = require('../config/database');
var util = require('util');
var passport = require('passport');

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/app');
    }
    res.render('registration', { title: 'Songster - Registration' });
});

router.post('/', function (req, res, next) {

    // parameter checks
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm_password', 'Confirm Password is required').notEmpty();
    req.checkBody('email', 'Valid E-Mail is required').isEmail();
    req.checkBody('first_name', 'First name is required').notEmpty();
    req.checkBody('last_name', 'Last name is required').notEmpty();
    req.assert('password', 'Passwords do not match').equals(req.body.confirm_password);

    var errors = req.validationErrors();

    if (errors) {
        res.status(400);
        res.render('registration', {message: util.inspect(errors)});
        return;
    }

    // hash password
    var l_user = new db.User();
    l_user.username = req.body.username;
    l_user.first_name = req.body.first_name;
    l_user.last_name = req.body.last_name;
    l_user.email = req.body.email;

    var salt = crypto.randomBytes(128).toString('base64');
    crypto.pbkdf2(req.body.password, salt, 10000, 512, function (err, hashedKey) {
        l_user.password = hashedKey.toString('base64');
        l_user.salt = salt;



        // !! IS REQUIRED FOR MOCHA TESTING - BUG OF MOCHA
        // callback of ensure indexes is called after indexes on user collection
        // are created - this is needed for async testing - otherwise unique indices are
        // not ensured and tests will fail that actually pass when are tested manually
        db.User.ensureIndexes(function (err) {
            if (err) throw err;

            // save user in db
            l_user.save(function (err, user) {
                if (err) {
                    // username already exists
                    if (err.code === 11000) {
                        res.status(400);
                        res.render('registration', {message: 'Username ' + l_user.username + ' already used. Please use another name.' });
                        return;
                    }

                    res.status(500);
                    res.render('registration', {message: l_user.username + ' could not be registered. Please try again.'});
                    return;
                }

                passport.authenticate('local-only-registered')(req, res, function () {
                    var redirectUrl = req.cookies.refererevent ? '/app/#/event/' + req.cookies.refererevent : '/';
                    res.clearCookie('refererevent');
                    return res.redirect(redirectUrl);
                });
            });
        });
    });


});

module.exports = router;