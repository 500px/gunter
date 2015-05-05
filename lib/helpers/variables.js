'use strict';
var _ = require('lodash');

// Public
module.exports = {
  processVars: function processVars(task, vars) {
    if (_.isPlainObject(vars)) {
      return replaceVars(task, vars);
    } else if (_.isString(vars)) {
      return parseJsonFile(task, vars);
    } else {
      throw new Error('vars only accepts a JSON Object or a String filepath');
    }
  }
};


// Private
function replaceVars(task, vars) {
  var taskClone = _.cloneDeep(task);

  // Handle vars object
  taskClone = doWork(taskClone, vars);

  // Handle defaults
  if (taskClone['defaults']) {
    taskClone = doWork(taskClone, taskClone['defaults']);
  }

  return taskClone;
}

function doWork(task, vars) {
  for (var i = 0; i < Object.keys(vars).length; i++) {
    var key = Object.keys(vars)[i];
    if (vars[key]) {
      for (var j = 0; j < task.commands.length; j++) {
        var command = task.commands[j];
        var mutatedCommand = command.replace("{{" + key + "}}", vars[key]);
        if (mutatedCommand != command) {
          task.commands[j] = mutatedCommand;
        }
      }
    }
  }

  return task;
}

function parseJsonFile(task, file) {
  var parsedJson = require(file);

  return replaceVars(task, parsedJson);
}
