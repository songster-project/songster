var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var crypto = require('crypto');
var db = require('../config/database');
var util = require('util');
var passport = require('passport');

router.get('/', function (req, res) {
    res.render('registration');
});

router.post('/', function (req, res, next){

    // parameter checks
    req.checkBody('username', 'Username must not be empty').notEmpty();
    req.checkBody('password', 'Password must not be empty').notEmpty();
    req.checkBody('confirm_password', 'Confirm Password must not be empty').notEmpty();
    req.checkBody('email', 'Valid E-Mail required').isEmail();
    req.assert('password', 'Passwords do not match').equals(req.body.confirm_password);

    var errors = req.validationErrors();

    if (errors) {
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
    crypto.pbkdf2(req.body.password, salt, 10000, 512, function(err, hashedKey){
        l_user.password = hashedKey.toString('base64');
        l_user.salt = salt;

       // save user in db
        l_user.save(function (err, user) {
            if (err) {
                if(err.code === 11000) {
                    res.render('registration', {message: 'Username ' + l_user.username + ' already used. Please use another name.' });
                    return;
                }

                res.render('registration', {message: l_user.username + ' could not be registered. Please try again.'});
                return;
            }
            console.log(user);

            passport.authenticate('local')(req,res, function() {
                return res.redirect('/');
            });
        });
    });

});

module.exports = router;