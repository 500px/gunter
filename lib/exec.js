'use strict';
var _ = require('lodash');
var errors = require('./helpers/errors');

function exec(taskname, vars) {
  errors.checkString(taskname, 'taskname must be a string');
  errors.checkNonEmpty(taskname, 'taskname must be non-empty');

  var task = getTask(taskname);

  if (_.isUndefined(vars)) {
    execTask(task);
  } else {
    var processedTask = processVars(task, vars);
    execTask(processedTask);
  }
}

function getTask(taskname) {
  var task = taskList[taskname];
  errors.checkDefined(task, taskname + ' is not defined');

  return task;
}

function processVars(task, vars) {
  if (_.isPlainObject(vars)) {
    return parseObject(task, vars);
  } else if (_.isString(vars)) {
    return parseJsonFile(task, vars);
  } else {
    throw new Error('vars only accepts a JSON Object or a String filepath');
  }
}

function parseObject(task, vars) {
  
}

function parseJsonFile(task, file) {
  var parsedJson = require(file);

  return parseObject(tasnk, parsedJson);
}

function execTask(task) {

}

module.exports = exec;
