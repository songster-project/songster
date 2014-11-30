var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportinit = require('./config/passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var expressValidator = require('express-validator');

var routes = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var account = require('./routes/account');
var song = require('./routes/song');
var playlist = require('./routes/playlist');
var registration = require('./routes/registration');
var event = require('./routes/event');
var search = require('./routes/search');
var settings = require('./config/settings.js');

var app = express();

var middleware=[];
middleware[0] = logger('dev');
middleware[1] = bodyParser.json();
middleware[2] = bodyParser.urlencoded({extended: false});
middleware[3] = expressValidator(
    {
        customValidators: {
            isMongoID: function (value) {
                return value.match("^[0-9a-fA-F]{24}$");
            },
            isBool: function (value) {
                return typeof value === 'boolean';
            }
        }
    }
);
middleware[4] = cookieParser(settings.cookie_secret);
middleware[5] = session({
    secret: settings.cookie_secret,
    store: new MongoStore({
        db: settings.db,
        host: settings.db_host,
        port: settings.db_port,
        username: settings.db_user,
        password: settings.db_pass
    }),
    saveUninitialized: true,
    resave: true
});
middleware[6] = passport.initialize();
middleware[7] = passport.session();
middleware[8] = express.static(path.join(__dirname, 'public'));

module.exports.middleware = middleware;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(middleware[0]);
app.use(middleware[1]);
app.use(middleware[2]);
app.use(middleware[3]);
app.use(middleware[4]);
app.use(middleware[5]);
app.use(middleware[6]);
app.use(middleware[7]);
app.use(middleware[8]);

app.use('/', routes);
app.use('/voting/:id',passportinit.redirectVoting);
app.use('/app', passportinit.ensureAuthenticated, express.static(path.join(__dirname, 'app')));
app.use('/login', login);
app.use('/logout', logout);
app.use('/account', account);
app.use('/song', song);
app.use('/playlist', playlist);
app.use('/registration', registration);
app.use('/event', event);
app.use('/search', search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
