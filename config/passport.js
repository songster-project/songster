var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../config/database.js');
var crypto = require('crypto');
var anonymoususer = {"username": "anon", "password": "123anon"};


function findById(id, fn) {

    db.User.findById(id, function (err, doc) {
        if (err) return fn(new Error('User ' + id + ' does not exist'));
        return fn(null, doc);
    })

}


function findByUsername(username, fn) {

    db.User.findOne({username: username}, function (err, doc) {
        if (err) return fn(null, null);
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
}

exports.ensureNotAnonymous = function ensureNotAnonymous(req, res, next) {
    //Only non anonymous user has access
    if (req.user.username != anonymoususer.username) {
        return next();
    }
    //TODO: currently it is restricted, maybe because of useability we want to redirect to a certain page here
    //or go to the login-page. For now (3-12-2014) it's enough to restrict the access.
    res.status(403).send('Forbidden for anonymous user');
}

exports.redirectVoting = function redirectVoting(req, res, next) {
    id = req.params.id;


    //If we are authenticated and NOT the anonymous user
    if (req.isAuthenticated() && req.user.username != user.username) {
        res.redirect('/app/#/voting/' + id);
    }
    //I need to be logged in and redirected to the anon page
    else {
        req.body = anonymoususer;
        passport.authenticate('local')(req, res, function () {
            console.log('authenticated anon and redirect to /app/#/voting/'+id+'/anon');
            return res.redirect('/app/#/voting/'+id+'/anon');
        });
    }
};

