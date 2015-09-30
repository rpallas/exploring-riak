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

describe('Nodiak', () => {
  var riak;

  beforeEach((done) => {
    riak = require('nodiak').getClient('http', 'localhost', 11098);
    done();
  });

  it('should ping riak', (done) => {
    riak.ping((err, result) => {
      expect(err).to.not.exist();
      expect(result).to.equal('OK');
      done();
    });
  });

  it('should retrieve stats from riak', (done) => {
    riak.stats((err, result) => {
      expect(result).to.exist();
      expect(result.connected_nodes).to.exist();
      expect(result.ring_members).to.exist();
      done();
    });
  });

  it('should store a key/value in riak', (done) => {
    var things = riak.bucket('things').objects;
    var thing = things.new('owner:name', {thing: 'value'});
    things.save(thing, (err, result) => {
      expect(result).to.exist();
      expect(result.data).to.exist();
      expect(result.data.thing).to.equal('value');
      done(err);
    });
  });

  it('should delete a key/value from riak', function (done) {
    var things = riak.bucket('things').objects;
    var thing = things.new('owner:name', { thing: 'value'});
    things.save(thing, (/*err, result*/) => {
      things.delete(thing, (err, result) => {
        expect(result.data).to.equal('');
        expect(result.metadata.status_code).to.equal(204);
        done(err);
      });
    });
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
      _.take(seedData.maximals, 6).forEach((maximal) => {
        data.push(maximals.new(`${maximal.owner}:${maximal.name}`, maximal));
      });
      maximals.save(data, done);
    };

    it('should retrieve a maximal from riak', (done) => {
      riak.bucket('maximals').objects.get(['test:foo'], (err, result) => {
        var maximal = result.shift().data;
        expect(maximal.name).to.equal('foo');
        done();
      });
    });

    it('should retrieve multiple maximals from riak', (done) => {
      var keys = ['test:foo', 'test:bar', 'test:baz', 'test:quux', 'test:zoo', 'root:foo'];
      riak.bucket('maximals').objects.get(keys, (err, result) => {
        expect(result.length).to.equal(6);
        expect(_.find(result, { data: { owner: 'test', name: 'foo'}})).to.exist();
        expect(_.find(result, { data: { name: 'bar'}})).to.exist();
        expect(_.find(result, { data: { name: 'baz'}})).to.exist();
        expect(_.find(result, { data: { name: 'quux'}})).to.exist();
        expect(_.find(result, { data: { name: 'zoo'}})).to.exist();
        expect(_.find(result, { data: { owner: 'root', name: 'foo'}})).to.exist();
        done();
      });
    });

    // TODO: have to setup indexes manually with curl - how do we do this with nodiak?
    it('should retrieve a maximal from riak using solr search', {skip: true}, (done) => {
      riak.bucket('maximals').search.solr({ q: 'name:b*' }, (err, result) => {
        // FIXME: figure out how to do this
        expect(JSON.parse(result.toString()).response.numFound).to.equal(2);
        done();
      });
    });
  });

});
