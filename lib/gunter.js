'use strict';

global.taskList = {};

// Public
module.exports = {
  load: require('./load'),
  clear: require('./clear'),
  exec: require('./exec'),
  emitter: require('./emitter')
}
