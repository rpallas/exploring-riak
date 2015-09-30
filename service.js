#!/usr/bin/env node

require('sequoia-lib-util').uncaught();

var service = require('./launch/service');
service.launch({});
