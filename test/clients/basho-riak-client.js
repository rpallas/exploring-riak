var _ = require('lodash');
var Async = require('async');
var Code = require('code');
var Lab = require('lab');

// Test shortcuts

var lab = exports.lab = Lab.script();
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('Basho Riak Client', () => {
  var riak;

  beforeEach((done) => {
    //riak = require('basho-riak-client')...
    done();
  });

  it('should ping riak', (done) => {
    //TODO
    done();
  });

  it('should retrieve stats from riak', (done) => {
    //TODO
    done();
  });

  it('should store a key/value in riak', (done) => {
    //TODO
    done();
  });

  it('should delete a key/value from riak', function (done) {
    //TODO
    done();
  });

  describe('With maximals', () => {

    var seedData = require('../_support/seeds/maximals.json');

    beforeEach((done) => {
      Async.series([
        clearDownData,
        runSeeds
      ], done);
    });

    var clearDownData = (done) => {
      //TODO
      done();
    };

    var runSeeds = (done) => {
      //TODO
      done();
    };

    it('should retrieve a maximal from riak', (done) => {
      //TODO
      done();
    });

    it('should retrieve multiple maximals from riak', (done) => {
      //TODO
      done();
    });

    it('should retrieve a maximal from riak using solr search', (done) => {
      //TODO
      done();
    });
  });

});
