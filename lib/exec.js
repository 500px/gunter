'use strict';
var _ = require('lodash');
var errors = require('./helpers/errors');
var variables = require('./helpers/variables')
var shell = require('shelljs');
var sequest = require('sequest');

// Public
module.exports = function exec(taskname, vars) {
  errors.checkString(taskname, 'taskname must be a string');
  errors.checkNonEmpty(taskname, 'taskname must be non-empty');

  var task = getTask(taskname);
  if (!(_.isUndefined(vars))) {
    task = variables.processVars(task, vars);
  }

  execTask(task, taskResponse);
}


// Private
function getTask(taskname) {
  var task = global.taskList[taskname];
  errors.checkDefined(task, taskname + ' is not defined');

  return task;
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
