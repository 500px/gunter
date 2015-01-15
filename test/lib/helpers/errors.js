var should = require('should');
var errors = require('../../../lib/helpers/errors');

describe('errors', function(){
  describe('checkDefined', function(){
    it('should be defined', function(){
      errors.checkDefined.should.exist;
    });

    it('should be a function', function(){
      errors.checkDefined.should.be.a.Function;
    });
  });

  describe('checkNonEmpty', function(){
    it('should be defined', function(){
      errors.checkNonEmpty.should.exist;
    });

    it('should be a function', function(){
      errors.checkNonEmpty.should.be.a.Function;
    });
  });

  describe('checkArray', function(){
    it('should be defined', function(){
      errors.checkArray.should.exist;
    });

    it('should be a function', function(){
      errors.checkArray.should.be.a.Function;
    });
  });
});
