var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/app');
    }

    res.render('login', { user: req.user, title: 'Songster - Login'});
});


router.post('/', function (req, res, next) {
    passport.authenticate('local-only-registered', function (err, user, info) {
        if (err) {
            res.status(400);
            return res.render('login', {message: [info.message]});
        }
        if (!user) {
            res.status(400);
            return res.render('login', {message: [info.message]});
        }
        req.logIn(user, function (err) {
            if (err) {
                res.status(500);
                return res.render('login', {message: [info.message]});
            }

            var redirectUrl = req.cookies.refererevent ? '/app/#/event/' + req.cookies.refererevent : '/';
            res.clearCookie('refererevent');
            return res.redirect(redirectUrl);
        });
    })(req, res, next);
});

module.exports = router;
