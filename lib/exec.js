'use strict';
var _ = require('lodash');
var errors = require('./helpers/errors');

function exec(taskname, vars) {
  errors.checkString(taskname, 'taskname must be a string');
  errors.checkNonEmpty(taskname, 'taskname must be non-empty');

  var task = getTask(taskname);

  if (_.isUndefined(vars)) {
    return execTask(task);
  } else {
    var processedTask = processVars(task, vars);
    return execTask(processedTask);
  }
}

function getTask(taskname) {
  var task = taskList[taskname];
  errors.checkDefined(task, taskname + ' is not defined');

  return task;
}

function processVars(task, vars) {
  if (_.isPlainObject(vars)) {
    return replaceVars(task, vars);
  } else if (_.isString(vars)) {
    return parseJsonFile(task, vars);
  } else {
    throw new Error('vars only accepts a JSON Object or a String filepath');
  }
}

function replaceVars(task, vars) {
  var processedTask = task;
  for (var i = 0; i < Object.keys(vars).length; i++) {
    var key = Object.keys(vars)[i];
    for (var j = 0; j < processedTask.commands.length; j++) {
      var command = processedTask.commands[j];
      var mutatedCommand = command.replace("{{" + key + "}}", vars[key]);
      if (mutatedCommand != command) {
        processedTask.commands[j] = mutatedCommand;
      }
    }
  }

  return processedTask;
}

function parseJsonFile(task, file) {
  var parsedJson = require(file);

  return replaceVars(task, parsedJson);
}

function execTask(task) {
  if (task.remote == 'localhost') {
    localTask(task);
  } else {
    remoteTask(task);
  }

  return task;
}

function localTask(task) {

}

function remoteTask(task) {
  
}

module.exports = exec;
