'use strict';
var _ = require('lodash');
var variables = require('./helpers/variables');
var emitter = require('./emitter');
var shell = require('shelljs');
var fs = require('fs');

// Public
module.exports = function exec(taskname, vars, callback) {
  if (!(_.isString(taskname))) {
    return callback('taskname must be a string');
  }

  if (_.isEmpty(taskname)) {
    return callback('taskname must be non-empty');
  }

  var task = global.taskList[taskname];
  if (_.isUndefined(task)) {
    return callback(taskname + ' is not defined');
  }

  if (!(_.isObject(vars)) && !(_.isString(vars))) {
    return callback('vars must be a String or an Object');
  }

  if (!(_.isEmpty(vars))) {
    try {
      task = variables.processVars(task, vars);
    } catch(err) {
      return callback(err);
    }
  }

  remoteOrLocal(task, callback);
};

// Private
function remoteOrLocal(task, callback) {
  if (task.remote == 'localhost') {
    local(task, callback);
  } else {
    remote(task, callback);
  }
}

function local(task, callback) {
  var commands = concatCommands(task.cwd, task.commands);

  try {
    var child = shell.exec(commands, {async:true}, function(code, output){
      if (code !== 0) return callback(output);
      return callback(null, task);
    });

    child.stdout.on('data', function(data){
      emitter.emit('stdout', data);
    });
  } catch(err) {
    return callback(err);
  }
}

function remote(task, callback) {
  var Client = require('ssh2').Client;
  var conn = new Client();
  var commands = concatCommands(task.cwd, task.commands);
  var auth = {};
  var agentForward = false;

  if (task.auth && task.auth.password) {
    auth = passwordAuth(task);
  } else if (task.auth && task.auth.privateKey) {
    try {
      var privateKey = fs.readFileSync(task.auth.privateKey)
    } catch(err) {
      return callback(err);
    }
    auth = privateKeyAuth(task, privateKey);
  } else {
    agentForward = true;
    auth = agentAuth(task);
  }

  conn.on('ready', function(){
    conn.exec(commands, { agentForward: agentForward }, function(err, stream){
      if (err) return callback(err);
      stream.on('close', function(code, signal) {
        if (code !== 0) return callback('ERROR: Exit status ' + code);
        conn.end();
        return callback(null, task);
      }).on('data', function(data) {
        emitter.emit('stdout', data);
      }).stderr.on('data', function(data) {
        return callback(data);
      });
    });
  }).on('error', function(err) {
    return callback(err);
  }).connect(auth);
}

function passwordAuth(task) {
  return {
    host: task.remote,
    port: task.auth.port || 22,
    username: task.auth.username || process.env.USER,
    password: task.auth.password,
  };
}

function privateKeyAuth(task, privateKey) {
  return {
    host: task.remote,
    port: task.auth.port || 22,
    username: task.auth.username || process.env.USER,
    privateKey: privateKey,
  };
}

function agentAuth(task) {
  var auth = {
    host: task.remote,
    agent: process.env.SSH_AUTH_SOCK,
    agentForward: true,
  };

  if (task.auth) {
    auth.port = task.auth.port || 22;
    auth.username = task.auth.username || process.env.USER;
  } else {
    auth.port = 22;
    auth.username = process.env.USER;
  }

  return auth;
}

function concatCommands(cwd, commands) {
  var concat = 'cd ' + cwd;

  commands.forEach(function(command){
    concat += ' && ' + command;
  });

  return concat;
}

