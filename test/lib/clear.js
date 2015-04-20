var should = require('should');
var clear = require('../../lib/clear');

describe('clear', function(){
  it('clears the global taskList', function(){
    global.taskList = { 'name' : 'Gunter' };
    clear();
    global.taskList.should.be.empty;
  });
});
