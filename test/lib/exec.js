var should = require('should');
var exec = require('../../lib/exec');

describe('exec', function(){
  describe('when passed only a name', function(){
    describe('when name is not a String', function(){
      it('throws an error');
    });

    describe('when name is an empty String', function(){
      it('throws an error');
    });

    describe('when name is well formed', function(){
      describe('when task is not defined', function(){
        it('throws an error');
      });

      describe('when task is defined', function(){
        describe('when remote is localhost', function(){
          it('executes the commands locally, in the cwd');
        });

        describe('when remote is some server', function(){
          it('executes the commands on the server, in the cwd');
        });
      });
    });
  });

  describe('when passed vars', function(){
    describe('when vars are an Object', function(){
      describe('when vars match variables in the task', function(){
        it('replaces the variables with values in var');
      });

      describe('when vars do not match variables in the task', function(){
        it('throws an error');
      });
    });

    describe('when vars are a String path', function(){
      describe('when the path is valid', function(){
        describe('when vars match variables in the task', function(){
          it('replaces the variables with values in var');
        });

        describe('when vars do not match variables in the task', function(){
          it('throws an error');
        });
      });

      describe('when the path is invalid', function(){
        it('throws an error');
      });
    });

    describe('when vars are neither an Object nor a String path', function(){
      it('throws an error');
    });
  });
});
