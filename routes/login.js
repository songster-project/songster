var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/app');
    }

    res.render('login', { user: req.user});
});


router.post('/', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return res.render('login', {message: [info.message]});
        }
        if (!user) {
            return res.render('login', {message: [info.message]});
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.render('login', {message: [info.message]});
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

module.exports = router;
