var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var crypto = require('crypto');
var db = require('../config/database');

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
        
        res.send('validation error');

    }
    // check if username not already in db
  /*  User.find({username: req.body.username}).count(function(err, count){
        assert.equal(null,err);
        if (count > 0) {
            res.send('username already exists');
            next();
        }
    }); */
    console.log('geht nu');
    // hash password
    var user = new db.User();
    console.log('geht nimma');
    console.log(user);
    console.log('1 ' + req.body.username);
    user.username = req.body.username;
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;

    console.log('name ' + user.username);

    var salt = crypto.randomBytes(128).toString('base64');

    console.log('after salt' + salt);
    crypto.pbkdf2(req.body.password, salt, 10000, 512, function(err, hashedKey){

        user.password = hashedKey.toString('base64');
        user.salt = salt;

        console.log(' in hash ' + user.password);

        // save user in db
        user.save(function (err, user) {
            if (err) console.error(err);
            console.log(user);
            res.send('user ' + user.username + ' successful registered!');
            //next();
        });
    });






    // redirect to successful

});

module.exports = router;