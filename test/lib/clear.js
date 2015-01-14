var should = require('should');
var clear = require('../../lib/clear');

describe('clear', function(){
  it('clears the global taskList', function(){
    taskList = { 'name' : 'Gunter' }
    clear();
    taskList.should.be.empty;
  });
});
