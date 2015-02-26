'use strict';
var _ = require('lodash');
var errors = require('./helpers/errors');

// Public
module.exports = function load(tasks) {
  if (_.isPlainObject(tasks)) {
    parseObject(tasks);
  } else if (_.isString(tasks)) {
    parseJsonFile(tasks);
  } else {
    throw new Error('load only accepts a JSON Object or a String filepath');
  }
}


// Private
function parseObject(tasks) {
  for (var i = 0; i < Object.keys(tasks).length; i++) {
    var key = Object.keys(tasks)[i];

    errors.checkDefined(tasks[key].remote, 'remote must be defined');
    errors.checkDefined(tasks[key].cwd, 'cwd must be defined');
    errors.checkDefined(tasks[key].privateKey, 'privateKey must be defined'); 
    errors.checkDefined(tasks[key].commands, 'commands must be defined');
    errors.checkArray(tasks[key].commands, 'commands must be defined as an array');
  }

  taskConcat(tasks);
}

function parseJsonFile(file) {
  var parsedJson = require(file);

  parseObject(parsedJson);
}

function taskConcat(tasks) {
  for (var attrname in tasks) { global.taskList[attrname] = tasks[attrname]; }
}
