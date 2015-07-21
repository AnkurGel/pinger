var express = require('express');
var q = require('q');
var router = express.Router();
var strftime = require('strftime');
var request = require('request');
var monk = require('monk');
var db = monk(process.env.PROD_MONGODB || "localhost:27017/pings");

/* GET home page. */
router.get('/', function(req, res, next) {
  var pingsCollection = req.pings;
  pingsCollection.find({}, {sort: {timestamp: -1}}, function(err, pings) {
    if(typeof(pings) == 'undefined') pings = [];
    res.render('index', { title: 'Pinger', strftime: strftime, pings: pings});
  });
});

function ping() {
  console.log("Pinging at ", new Date().getTime());
  var defer = q.defer();
  request(process.env.PING_URL || 'http://localhost:3001', function(err, data) {
    setTimeout(function() {
      try{
        defer.resolve(JSON.parse(data.body));
      } catch(e) {
        defer.reject({
          response: "Couldn't connect for some reason",
          timestamp: new Date().getTime()
        });
      }
    }, 5000);
  });
  defer.promise.then(pingLog, pingLog).then(ping).done();
}
function pingLog(json) {
  var pingsCollection = db.get('pings');
  pingsCollection.insert(json, function(req, ping){
    console.log(json);
  });
}
ping();

module.exports = router;
