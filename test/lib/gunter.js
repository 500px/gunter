var should = require('should');
var gunter = require('../../lib/gunter');

describe('gunter', function(){
  it('should exist', function(){
    gunter.should.exist;
  });

  it('should not be empty', function(){
    gunter.should.not.be.empty;
  });

  it('should be an Object', function(){
    gunter.should.be.an.Object;
  });

  describe('load', function(){
    it('should exist', function(){
      gunter.load.should.exist;
    });

    it('should be a function', function(){
      gunter.load.should.be.a.Function;
    });
  });

  describe('clear', function(){
    it('should exist', function(){
      gunter.clear.should.exist;
    });

    it('should be a function', function(){
      gunter.clear.should.be.a.Function;
    });
  });

  describe('exec', function(){
    it('should exist', function(){
      gunter.exec.should.exist;
    });

    it('should be a function', function(){
      gunter.exec.should.be.a.Function;
    });
  });
});
