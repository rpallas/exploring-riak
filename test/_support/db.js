var _ = require('lodash');
var Async = require('async');
var Path = require('path');

var riak = require('nodiak').getClient('http', 'localhost', 11098);

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
  var data = [];
  var maximals = riak.bucket('maximals').objects;
  seedData.maximals.forEach((maximal) => {
    data.push(maximals.new(`${maximal.owner}:${maximal.name}`, maximal));
  });
  maximals.save(data, done);
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
