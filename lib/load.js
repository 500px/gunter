'use strict';
var _ = require('lodash');


function load(tasks) {
  if (_.isPlainObject(tasks)) {
    parseObject(tasks);
  } else if (_.isString(tasks)) {
    parseJsonFile(tasks);
  } else {
    throw new Error('load only accepts a String filepath or a JSON Object');
  }
}

function parseObject(tasks) {
  for (var i = 0; i < Object.keys(tasks).length; i++) {
    var key = Object.keys(tasks)[i];

    checkUndefined(tasks[key].remote, 'remote must be defined');
    checkUndefined(tasks[key].cwd, 'cwd must be defined');
    checkUndefined(tasks[key].commands, 'commands must be defined');
  }

  taskList = {};
}

function parseJsonFile(file) {
  var parsedJson = require(file);

  parseObject(parsedJson);
}

function checkUndefined(arg, message) {
  if (_.isUndefined(arg)) {
    throw new Error(message);
  }
}

function checkNonEmpty(arg, message) {
  if (_.isEmpty(arg)) {
    throw new Error(message);
  }
}

module.exports = load;
