var Async = require('async');

var resources = [];
require('fs').readdirSync(__dirname).forEach(function (file) {
  if (file !== 'index.js') {
    resources.push(require('./' + file.replace('.js', '')));
  }
});

exports.register = function (plugin, options, next) {
  Async.each(resources, function (resource, callback) {
    resource.register(plugin, options, callback);
  }, next);
};
