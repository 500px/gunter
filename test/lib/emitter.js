var should = require('should');
var EventEmitter = require('events').EventEmitter;
var emitter = require('../../lib/emitter');

describe('emitter', function(){
  it('should be defined', function(){
    emitter.should.exist;
  });

  it('should be an Object', function(){
    emitter.should.be.an.Object;
  });

  it('should be an instance of EventEmitter', function(){
    emitter.should.be.an.instanceof(EventEmitter);
  });
});
