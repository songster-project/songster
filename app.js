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
var validUrl = require('valid-url');
var app = express();

module.exports = app;

//add express-ws
require('./backend/services/express-ws')();
//initialize notification_server
require('./backend/services/notification_server')();

var routes = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var account = require('./routes/account');
var song = require('./routes/song');
var playlist = require('./routes/playlist');
var registration = require('./routes/registration');
var event = require('./routes/event');
var search = require('./routes/search');
var eventlog = require('./routes/eventlog');
var settings = require('./config/settings.js');
var voting = require('./routes/voting');
var youtube = require('./routes/youtube');
var eventsong = require('./routes/eventsong');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator(
    {
        customValidators: {
            isMongoID: function (value) {
                return value.match("^[0-9a-fA-F]{24}$");
            },
            isBool: function (value) {
                return typeof value === 'boolean';
            },
            isInArray: function (value, array) {
                return array.indexOf(value) >= 0;
            },
            isValidUrl: function (value) {
                return validUrl.isUri(value);
            }
        }
    }
));
app.use(cookieParser(settings.cookie_secret));
app.use(session({
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
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/app', passportinit.ensureAuthenticated, express.static(path.join(__dirname, 'app')));
app.use('/login', login);
app.use('/logout', logout);
app.use('/account', account);
app.use('/song', eventsong);
app.use('/song', song);
app.use('/playlist', playlist);
app.use('/registration', registration);
app.use('/event', event);
app.use('/search', search);
app.use('/eventlog', eventlog);
app.use('/voting', voting);
app.use('/youtube', youtube);

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
