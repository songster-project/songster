//Initalization of our url-shortener
//Nice property of it: shortening the same link again, reproduces the same output!
var settings = require('./settings');
var Bitly = require('bitly');

var  bitly = new Bitly(settings.bitly_user,settings.bitly_apikey);
exports.shortener = bitly;