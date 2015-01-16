'use strict';
var _ = require('lodash');

function checkDefined(arg, message) {
  if (_.isUndefined(arg)) {
    throw new Error(message);
  }
}

function checkNonEmpty(arg, message) {
  if (_.isEmpty(arg)) {
    throw new Error(message);
  }
}

function checkString(arg, message) {
  if (!(_.isString(arg))) {
    throw new Error(message);
  }
}

function checkArray(arg, message) {
  if (!(_.isArray(arg))) {
    throw new Error(message);
  }
}

module.exports.checkDefined = checkDefined;
module.exports.checkNonEmpty = checkNonEmpty;
module.exports.checkString = checkString;
module.exports.checkArray = checkArray;
