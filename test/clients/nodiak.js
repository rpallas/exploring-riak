var _ = require('lodash');
var Lab = require('lab');
var Code = require('code');
var DbSupport = require('./../_support/db');

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

var poc = require('../../lib/index');


before((done) => {
  done();
});

after((done) => {
  done();
});

describe('Nodiak', () => {

  it('should retrieve stats from riak', (done) => {
    db.stats((err, result) => {
      expect(result).to.exist();
      expect(result.connected_nodes).to.exist();
      expect(result.ring_members).to.exist();
      done();
    });
  });

   it('should store a key/value in riak', (done) => {
     var things = db.bucket('things').objects;
     var thing = things.new('owner:name', { thing: 'value'});
     things.save(thing, (err, result) => {
       expect(result).to.exist();
       expect(result.data).to.exist();
       expect(result.data.thing).to.equal('value');
       done(err);
     });
   });

  it('should retrieve a maximal from riak', (done) => {
    db.bucket('maximals').objects.get(['test:foo'], (err, result) => {
      var maximal = result.shift().data;
      expect(maximal.name).to.equal('foo');
      done();
    });
  });

  // it('should delete a maximal from riak', function (done) {
  //   done();
  // });

});
