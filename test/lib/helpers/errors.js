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

    describe('when arg is defined', function(){
      var test = 'wenk';
      it('should not throw an error', function(){
        errors.checkDefined.bind(null, test, 'test').should.not.throw();
      });
    });

    describe('when arg is not defined', function(){
      var test = undefined;
      it('should throw an error with message', function(){
        errors.checkDefined.bind(null, test, 'test').should.throw('test');
      });
    });
  });

  describe('checkNonEmpty', function(){
    it('should be defined', function(){
      errors.checkNonEmpty.should.exist;
    });

    it('should be a function', function(){
      errors.checkNonEmpty.should.be.a.Function;
    });

    describe('when arg is non-empty', function(){
      var test = 'wenk';
      it('should not throw an error', function(){
        errors.checkNonEmpty.bind(null, test, 'test').should.not.throw();
      });
    });

    describe('when arg is empty', function(){
      var test = '';
      it('should throw an error with message', function(){
        errors.checkNonEmpty.bind(null, test, 'test').should.throw('test');
      });
    });
  });

  describe('checkString', function(){
    it('should be defined', function(){
      errors.checkString.should.exist;
    });

    it('should be a function', function(){
      errors.checkString.should.be.a.Function;
    });

    describe('when arg is a string', function(){
      var test = 'some string';
      it('should not throw an error', function(){
        errors.checkString.bind(null, test, 'test').should.not.throw();
      });
    });

    describe('when arg is not a string', function(){
      var test = 3;
      it('should an throw error with message', function(){
        errors.checkString.bind(null, test, 'test').should.throw('test');
      });
    });
  });

  describe('checkArray', function(){
    it('should be defined', function(){
      errors.checkArray.should.exist;
    });

    it('should be a function', function(){
      errors.checkArray.should.be.a.Function;
    });

    describe('when arg is an array', function(){
      var test = [1,2,3];
      it('should not throw an error', function(){
        errors.checkArray.bind(null, test, 'test').should.not.throw();
      });
    });

    describe('when arg is not an array', function(){
      var test = 3;
      it('should throw an error with message', function(){
        errors.checkArray.bind(null, test, 'test').should.throw('test');
      });
    });
  });
});
