'use strict';
var _ = require('lodash');
var errors = require('./helpers/errors');
var variables = require('./helpers/variables');
var emitter = require('./emitter');
var shell = require('shelljs');

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
  var commands = concatCommands(task.cwd, task.commands);

  try {
    var child = shell.exec(commands, {async:true}, function(code, output){
      if (code != 0) return callback(output);
      return callback(null, task);
    });

    child.stdout.on('data', function(data){
      emitter.emit('stdout', data);
    });
  } catch(err) {
    return callback(err);
  }
}

function remoteTask(task, callback) {
  var Client = require('ssh2').Client;
  var conn = new Client();
  var remoteSplit = task.remote.split('@');
  var user = remoteSplit[0];
  var remote = remoteSplit[1];

  var commands = concatCommands(task.cwd, task.commands);

  conn.on('ready', function(){
    conn.exec(commands, function(err, stream){
      if (err) return callback(err);
      stream.on('close', function(code, signal) {
        if (code != 0) return callback('ERROR: Exit status ' + code);
        conn.end();
        return callback(null, task);
      }).on('data', function(data) {
        emitter.emit('stdout', data);
      }).stderr.on('data', function(data) {
        return callback(data);
      });
    });
  }).connect({
    host: remote,
    port: 22,
    username: user,
  });
}

function concatCommands(cwd, commands) {
  var concat = 'cd ' + cwd;

  commands.forEach(function(command){
    concat += ' && ' + command;
  });

  return concat;
}

function taskResponse(err, task) {
  if (err){
    throw new Error(err);
  }
  emitter.emit('end');
}
