'use strict';

global.taskList = {};

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

// Public
module.exports = {
  load: require('./load'),
  clear: require('./clear'),
  exec: require('./exec'),
  emitter: require('./emitter')
}
