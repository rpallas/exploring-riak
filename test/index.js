var _ = require('lodash');
var Lab = require('lab');
var Code = require('code');
var DbSupport = require('./_support/db');

// Test shortcuts

var lab = exports.lab = Lab.script();
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

// Database

var db = DbSupport.db;
before(DbSupport.before);
// beforeEach(DbSupport.beforeEach);
// afterEach(DbSupport.afterEach);

// System under test

var poc = require('../lib');


before(function (done) {
});

after(function (done) {
});

describe('Proof of concept', function () {

  // it('should store a maximal in riak', function (done) {
  //   done();
  // });

  it('should retrieve a maximal from riak', function (done) {
    db.fetchValue({bucket: 'maximals', key: 'test:foo'}, (err, result) => {
      var maximal = results.values.shift();
      console.log(maximal);
      expect(maximal.name).to.equal('foo');
      done();
    });
  });

  // it('should delete a maximal from riak', function (done) {
  //   done();
  // });

});
