var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function (req, res) {
    res.render('registration');
});

router.post('/', function (req, res, next){

    // check if password and rep_password is equal

    // check if username not already in db

    // hash password

    // save user in db

    // redirect to successful

});

module.exports = router;