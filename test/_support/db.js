var _ = require('lodash');
var Async = require('async');
var Path = require('path');

var Riak = require('basho-riak-client');

var seedData = require('./seeds/maximals.json');
var db = new Riak.Client([
  '127.0.0.1:8098',
]);

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
  Async.each([seedData.maximals[0]], (maximal, callback) => {
    console.log(`Deleting ${maximal.owner}:${maximal.name}`);
    db.deleteValue({ bucket: 'maximals', key: `${maximal.owner}:${maximal.name}`}, (err, result) => {
      console.log(err || `${maximal.owner}:${maximal.name} deleted`);
      callback(err, result);
    });
  }, done);
};

var runSeeds = (done) => {
  Async.each([seedData.maximals[0]], (maximal, callback) => {
    console.log(`Storing ${maximal.owner}:${maximal.name}`);
    db.storeValue({
      bucket: 'maximals',
      key: `${maximal.owner}:${maximal.name}`,
      value: maximal
    }, (err, result) => {
      console.log(err || `Stored ${maximal.owner}:${maximal.name}`);
      callback(err, result);
    });
  }, done);
};

var afterEach = (done) => {
  clearDownData(done);
};

var after = (done) => {
  db.shutdown((state) => {
    if (state === Riak.Cluster.State.SHUTDOWN) {
      console.log("cluster stopped");
      process.exit();
    }
    done();
  });
};

exports = module.exports = {
  db: db,
  before: before,
  beforeEach: beforeEach,
  afterEach: afterEach,
  after: after
};
