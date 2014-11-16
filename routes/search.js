var express = require('express');
var elasticsearch = require('elasticsearch');
var router = express.Router();
var passport = require('../config/passport');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var getSourceElementsFromResponse = function(response) {

  var array = [];

  response.hits.hits.forEach(function(value) {
    array.push(value._source);
  });
  return array;
};

router.get('/', passport.ensureAuthenticated, function (req, res) {
  client.search({
  index: 'users',
  size: 50,
  body: {
    query: {
      match: {
        profile: 'elasticsearch'
      }
    }
  }
}).then(function (resp) {
  var hits = resp.body.hits;
});
    res.send('This is the search!');
});

router.get('/song/title/:name', passport.ensureAuthenticated, function (req, res) {
  client.search({
    index: 'songs',
    q: 'title:' + req.params.name
  }, function (error, response) {
    if (!error) {
      res.send(getSourceElementsFromResponse(response));
    }
  });

});

router.get('/song/album/:name', passport.ensureAuthenticated, function (req, res) {
  client.search({
    index: 'songs',
    q: 'album:' + req.params.name
  }, function (error, response) {
    if (!error) {
      res.send(getSourceElementsFromResponse(response));
    }
  });
});

router.get('/song/artist/:name', passport.ensureAuthenticated, function (req, res) {
  client.search({
    index: 'songs',
    q: 'artist:' + req.params.name
  }, function (error, response) {
    if (!error) {
      res.send(getSourceElementsFromResponse(response));
    }
  });
});

router.get('/song/year/:name', passport.ensureAuthenticated, function (req, res) {
  client.search({
    index: 'songs',
    q: 'year:' + req.params.name
  }, function (error, response) {
    if (!error) {
      res.send(getSourceElementsFromResponse(response));
    }
  });
});

console.log('Song.js ran');

module.exports = router;
