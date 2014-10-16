var express = require('express');
var router = express.Router();
var passport = require('../config/passport');

router.get('/', passport.ensureAuthenticated, function (req, res) {
    res.render('account', { id: req.session.passport.user });
});

module.exports = router;
