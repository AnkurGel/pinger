var express = require('express');
var q = require('q');
var router = express.Router();
var strftime = require('strftime');
var request = require('request');
var monk = require('monk');
var basicAuth = require("basic-auth-connect");


var auth = basicAuth('foo', 'bar');
var db = monk(process.env.PROD_MONGODB || "localhost:27017/pings");
var defer;

/* GET home page. */
router.get('/', auth, function(req, res, next) {
  var pingsCollection = req.pings;
  pingsCollection.find({}, {sort: {timestamp: -1}}, function(err, pings) {
    if(typeof(pings) == 'undefined') pings = [];
    res.render('index', { title: 'Pinger', strftime: strftime, pings: pings});
  });
});

router.post('/ping.json', function(req, res, next) {
  var pingsCollection = req.pings;
  pingsCollection.update(req.body._id, { $set: { pingBack: true }}, function(err, data) {
  });
  res.json({status: true});
});
var sleepTime = new Date();
sleepTime.setHours(22);

function ping() {
  if(new Date() < sleepTime) {
    console.log("Pinging at ", new Date().getTime());
    defer = q.defer();
    var requestData;
    request(process.env.PING_URL || 'http://localhost:3001', function(err, data) {
      setTimeout(function() {
        try{
          requestData = JSON.parse(data.body);
          requestData.pingBack = false; // default
          defer.resolve(requestData);
        } catch(e) {
          defer.reject({
            response: "Couldn't connect for some reason",
            timestamp: new Date().getTime()
          });
        }
      }, 15*60*1000);
    });
    defer.promise.then(pingLog, pingLog).then(ping).done();
  } else {
    console.log("Putting pingLOL at rest on ", new Date());
  }
}
function pingLog(json) {
  var pingsCollection = db.get('pings');
  pingsCollection.insert(json, function(req, ping){
    var opts = {
      url: process.env.PINGLOL_URL || 'http://localhost:3000/ping.json',
      body: json,
      json: true
    };
    request.post(opts, function(err, res){ });
  });
}
ping();

module.exports = router;
