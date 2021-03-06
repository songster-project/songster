var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../config/database.js');
var crypto = require('crypto');
//var anonymoususer = {"username": "anon", "password": "123anon"};
var promise = require("promise");

function findById(id, fn) {

    db.User.findById(id, function (err, doc) {
        if (err) return fn(new Error('User ' + id + ' does not exist'));
        return fn(null, doc);
    })

}


function findByUsername(username, fn) {

    db.User.findOne({username: username}, function (err, doc) {
        if (err) {
            console.log(err);
            return fn(null, null);
        }
        return fn(null, doc);
    })
}

function findByUsernameOnlyRegistered(username, fn) {

    db.User.findOne({username: username, anonymous:{ $ne: true }}, function (err, doc) {
        if (err) {
            console.log(err);
            return fn(null, null);
        }
        return fn(null, doc);
    })
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
    function (username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.  Otherwise, return the
            // authenticated `user`.
            findByUsername(username, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Invalid username or password'});
                }

                // hash password
                crypto.pbkdf2(password, user.salt, 10000, 512, function (err, hashedKey) {
                    var hash_password = hashedKey.toString('base64');
                    if (user.password != hash_password) {
                        return done(null, false, {message: 'Invalid username or password'});
                    }
                    return done(null, user);
                });
            });
        });
    }
));

passport.use('local-only-registered', new LocalStrategy(
    function (username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.  Otherwise, return the
            // authenticated `user`.
            console.log('in local only registered');
            findByUsernameOnlyRegistered(username, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Invalid username or password'});
                }

                // hash password
                crypto.pbkdf2(password, user.salt, 10000, 512, function (err, hashedKey) {
                    var hash_password = hashedKey.toString('base64');
                    if (user.password != hash_password) {
                        return done(null, false, {message: 'Invalid username or password'});
                    }
                    return done(null, user);
                });
            });
        });
    }
));


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

exports.ensureNotAnonymous = function ensureNotAnonymous(req, res, next) {
    //Only non anonymous user has access
    if (req.user.anonymous != true) {
        return next();
    }
    //TODO: currently it is restricted, maybe because of useability we want to redirect to a certain page here
    //or go to the login-page. For now (3-12-2014) it's enough to restrict the access.
    res.status(403).send('Forbidden for anonymous user');
};

function createAndSaveAnonymousUserAndRedirect(req, res, redirectUrl, event_id) {
    var l_anonymous = new db.User();
    l_anonymous.username = guid();
    l_anonymous.anonymous = true;

    var salt = crypto.randomBytes(128).toString('base64');
    crypto.pbkdf2('anonpassword' + l_anonymous.username, salt, 10000, 512, function (err, hashedKey) {
        l_anonymous.password = hashedKey.toString('base64');
        l_anonymous.salt = salt;

        // save anonymous user in db
        l_anonymous.save(function (err, user) {
            if (err) throw err;

            var authAnonUser = {
                username: user.username,
                password: 'anonpassword' + user.username
            }

            req.body = authAnonUser; // required for authentication by passport

            passport.authenticate('local')(req, res, function () {
                res.cookie('anonymous', 'true', {httpOnly: false});
                res.cookie('refererevent', event_id, {httpOnly: true});
                return res.redirect(redirectUrl);
            });
        });
    })
};

function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

exports.redirectVoting = function redirectVoting(req, res, next) {
    var id = req.params.id;
    console.log('in redirect voting');

    db.Event.findOne({_id: id}, function (err, event) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }

        if (event == null) {
            console.log('event not found');
            res.status(400).send('Bad Request');
            return;
        }

        // set cookie that contains event_id for redirecting after anonymous registers or logs in
        var redirectUrl = '/app/#/event/' + event._id;
        //If we are authenticated
        console.log('redirect voting');
        if (req.isAuthenticated()) {
            if(req.user.anonymous === true) {   // in user doc anonymous true is guaranteed to be set, but false not
                res.cookie('anonymous', 'true', {httpOnly: false});
            } else {
                res.cookie('anonymous', 'false', {httpOnly: false});
            }
            return res.redirect(redirectUrl);
        }
        // If we are not authenticated an anonymous user is created and logged in
        else {
            return createAndSaveAnonymousUserAndRedirect(req, res, redirectUrl, event._id);

        }
    });
};




