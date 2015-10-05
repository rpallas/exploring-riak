var _ = require('lodash');
var Async = require('async');
var Code = require('code');
var Lab = require('lab');
var Riak = require('riak-js');

// Test shortcuts

var lab = exports.lab = Lab.script();
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('Riak-js Client', () => {
  var riak;

  beforeEach((done) => {
    riak = Riak({host: "127.0.0.1", port: "11098"});
    done();
  });

  it('should ping riak', (done) => {
    riak.ping((err, result) => {
      expect(result).to.equal(true);
      done(err);
    });
  });

  it('should retrieve stats from riak', (done) => {
    riak.stats((err, result) => {
      expect(result).to.exist();
      done(err);
    });
  });

  it('should store a key/value in riak', {skip:true}, (done) => {
    riak.save('things', 'owner:name', {thing: 'value'}, (err, result) => {
      expect(result).to.exist();
      done(err);
    });
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
