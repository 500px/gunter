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

    checkDefined(tasks[key].remote, 'remote must be defined');
    checkDefined(tasks[key].cwd, 'cwd must be defined');
    checkDefined(tasks[key].commands, 'commands must be defined');
    checkArray(tasks[key].commands, 'commands must be defined as an array');
  }

  taskConcat(tasks);
}

function parseJsonFile(file) {
  var parsedJson = require(file);

  parseObject(parsedJson);
}

function taskConcat(tasks) {
  for (var attrname in tasks) { taskList[attrname] = tasks[attrname]; }
}

function checkDefined(arg, message) {
  if (_.isUndefined(arg)) {
    throw new Error(message);
  }
}

function checkArray(arg, message) {
  if (!(_.isArray(arg))) {
    throw new Error(message);
  }
}

module.exports = load;
