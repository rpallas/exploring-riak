var _ = require('lodash');
var Async = require('async');
var Code = require('code');
var Lab = require('lab');

var Riak = require('basho-riak-client');
// Test shortcuts

var lab = exports.lab = Lab.script();
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('Basho Riak Client', {skip: false}, () => {
  var riak;

  before((done) => {
    riak = new Riak.Client([
      '192.168.99.100:32769',
      '192.168.99.100:32771',
      '192.168.99.100:32773',
      '192.168.99.100:32775',
      '192.168.99.100:32777'
    ]);
    done();
  });

  it('should ping riak', (done) => {
    riak.ping((err, result) => {
      expect(result).to.equal(true);
      done(err);
    });
  });

  it('should store and fetch a key/value in riak', (done) => {
    riak.storeValue({ bucket: 'things', key: 'owner:name', value: {thing: 'value'}}, (err, result) => {
      expect(result).to.exist();
      riak.fetchValue({ bucket: 'things', key: 'owner:name', convertToJs: true}, (err, result) => {
        expect(result.values).not.to.be.empty();
        expect(result.values[0].value.thing).to.equal('value');
        done(err);
      });
    });
  });

  it('should delete a key/value from riak', (done) => {
    riak.storeValue({ bucket: 'things', key: 'owner:name', value: {thing: 'value'}}, (err, result) => {
      expect(result).to.exist();
      riak.deleteValue({ bucket: 'things', key: 'owner:name'}, () => {
        riak.fetchValue({ bucket: 'things', key: 'owner:name', convertToJs: true}, (err, result) => {
          expect(result.values).to.be.empty();
          done(err);
        });
      });
    });
  });

  describe('With maximals', () => {

    var maximalSeeds = _.take(require('../_support/seeds/maximals.json').maximals, 6);

    beforeEach((done) => {
      Async.series([
        clearDownData,
        runSeeds
      ], done);
    });

    var clearDownData = (done) => {
      Async.each(maximalSeeds, (maximal, callback) => {
        riak.deleteValue({ bucket: 'maximals', key: `${maximal.owner}:${maximal.name}`}, callback);
      }, done);
    };

    var runSeeds = (done) => {
      Async.each(maximalSeeds, (maximal, callback) => {
        riak.storeValue({
          bucket: 'maximals',
          key: `${maximal.owner}:${maximal.name}`,
          value: maximal
        }, callback);
      }, done);
    };

    it('should retrieve a maximal from riak', (done) => {
      riak.fetchValue({ bucket: 'maximals', key: 'test:foo', convertToJs: true}, (err, result) => {
        expect(result.values).not.to.be.empty();
        expect(result.values[0].value.name).to.equal('foo');
        done(err);
      });
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
