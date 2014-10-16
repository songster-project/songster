var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/app');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
