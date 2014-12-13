var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    req.logout();
    res.clearCookie('anonymous');
    res.redirect('/');
});

module.exports = router;
