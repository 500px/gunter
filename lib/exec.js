'use strict';
var _ = require('lodash');
var errors = require('./helpers/errors');
var variables = require('./helpers/variables');
var emitter = require('./emitter');
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
  try {
    var result = shell.exec('cd ' + task.cwd);
    if (result.code != 0) {
      return callback(result.output);
    }
  } catch(err) {
    return callback(err);
  }

  task.commands.forEach(function (command) {
    try {
      var result = shell.exec(command);
      if (result.code != 0) {
        return callback(result.output);
      }
      emitter.emit('command', command);
    } catch(err) {
      return callback(err);
    }
  });

  return callback(null, task);
}

function remoteTask(task, callback) {
  try {
    var seq = sequest(task.remote);
  } catch(err) {
    return callback(err);
  }

  task.commands.forEach(function (command) {
    try {
      seq.write("cd " + task.cwd + " && " + command, function() {
        emitter.emit('command', command);
      });
    } catch(err) {
      return callback(err);
    }
  });

  try {
    seq.write('echo closing connection...', function() {
      seq.end();
      return callback(null, task);
    });
  } catch(err) {
    return callback(err);
  }
}

function taskResponse(err, task) {
  if (err){
    throw new Error(err);
  }
  emitter.emit('end');
}
