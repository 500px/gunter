'use strict';
var _ = require('lodash');
var errors = require('./helpers/errors');
var shell = require('shelljs');
var sequest = require('sequest');

function exec(taskname, vars) {
  errors.checkString(taskname, 'taskname must be a string');
  errors.checkNonEmpty(taskname, 'taskname must be non-empty');

  var task = getTask(taskname);
  if (!(_.isUndefined(vars))) {
    task = processVars(task, vars);
  }

  execTask(task, taskResponse);
}

function getTask(taskname) {
  var task = global.taskList[taskname];
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

function execTask(task, callback) {
  if (task.remote == 'localhost') {
    localTask(task, callback);
  } else {
    remoteTask(task, callback);
  }
}

function localTask(task, callback) {
  var commands = task.commands;
  shell.cd(task.cwd);

  for (var i = 0; i < commands.length; i++) {
    try {
      shell.exec(commands[i]);
    } catch(err) {
      return callback(err);
    }
  }

  return callback(null, task);
}

function remoteTask(task, callback) {
  var commands = task.commands;

  try {
    var seq = sequest(task.remote);
  } catch(error) {
    return callback(err);
  }

  for (var i = 0; i < commands.length; i++) {
    try {
      seq.write("cd " + task.cwd + " && " + commands[i]);
    } catch(err) {
      return callback(err);
    }
  }

  return callback(null, task);
}

function taskResponse(err, task) {
  if (err){
    throw new Error(err);
  }
  return task;
}

module.exports = exec;
