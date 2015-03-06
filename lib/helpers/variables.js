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
}


// Private
function replaceVars(task, vars) {
  var processedTask = _.cloneDeep(task);
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
