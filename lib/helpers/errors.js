'use strict';
var _ = require('lodash');

// Public
module.exports = {
  checkDefined: function checkDefined(arg, message) {
    if (_.isUndefined(arg)) {
      throw new Error(message);
    }
  },

  checkNonEmpty: function checkNonEmpty(arg, message) {
    if (_.isEmpty(arg)) {
      throw new Error(message);
    }
  },

  checkString: function checkString(arg, message) {
    if (!(_.isString(arg))) {
      throw new Error(message);
    }
  },

  checkArray: function checkArray(arg, message) {
    if (!(_.isArray(arg))) {
      throw new Error(message);
    }
  }
};
