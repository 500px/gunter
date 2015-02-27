'use strict';

global.taskList = {};

process.on('uncaughtException', function (err) {
  throw new Error('Caught exception: ' + err);
});

// Public
module.exports = {
  load: require('./load'),
  clear: require('./clear'),
  exec: require('./exec'),
  emitter: require('./emitter')
}
