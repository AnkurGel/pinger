var express = require('express');
var commitment = require('javascript-commitment');
var app = express();

app.get('/', function(req, res) {
  var commit = commitment.whatThe();
  res.json({response: commit.message, timestamp: new Date().getTime()});
});

app.listen(3001);
