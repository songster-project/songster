var express = require('express');
var passport = require('../config/passport');
var db = require('../config/database');
var expressValidator = require('express-validator');
var router = express.Router();
var util = require('util');

module.exports = router;