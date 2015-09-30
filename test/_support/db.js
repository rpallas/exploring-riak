var _ = require('lodash');
var Async = require('async');
var Path = require('path');

var riak = require('nodiak').getClient();

//riak.stats((err, response) => {
//  console.log(err || response);
//});

var seedData = require('./seeds/maximals.json');

var before = (done) => {
  runSeeds(done);
};

var beforeEach = (done) => {
  Async.series([
    clearDownData,
    runSeeds
  ], done);
};

var clearDownData = (done) => {
  var maximals = riak.bucket('maximals').objects;
  Async.auto({
    maximals: (callback) => {
      maximals.all(callback);
    },
    deletes: ['maximals', (callback, results) => {
      maximals.delete(results.maximals, callback);
    }]
  }, done);
};

var runSeeds = (done) => {
  var riakData = [];
  var maximals = riak.bucket('maximals').objects;
  seedData.maximals.forEach((maximal) => {
    riakData.push(maximals.new(`${maximal.owner}:${maximal.name}`, maximal));
  });
  maximals.save(riakData, done);
};

var afterEach = (done) => {
  clearDownData(done);
};

var after = (done) => {
  done();
};

exports = module.exports = {
  db: riak,
  before: before,
  beforeEach: beforeEach,
  afterEach: afterEach,
  after: after
};
