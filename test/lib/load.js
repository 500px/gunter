var should = require('should');
var load = require('../../lib/load');

describe('load', function(){
  describe('when passed a JSON object', function(){
    describe('when JSON is valid', function(){
      it('adds the tasks to the global taskList');
    });

    describe('when JSON is missing remote', function(){
      it('throws an error');
    });

    describe('when JSON is missing cwd', function(){
      it('throws an error');
    });

    describe('when JSON is missing commands', function(){
      it('throws an error');
    });

    describe('when there is a syntax error', function(){
      it('throws an error');
    });
  });

  describe('when passed a file path', function(){
    describe('when path leads to JSON file', function(){
      describe('when JSON is valid', function(){
        var filepath = '../fixtures/valid.json';

        it('adds the tasks to the global taskList');
      });

      describe('when JSON is missing remote', function(){
        var filepath = '../fixtures/missing-remote.json';

        it('throws an error');
      });

      describe('when JSON is missing cwd', function(){
        var filepath = '../fixtures/missing-cwd.json';

        it('throws an error');
      });

      describe('when JSON is missing commands', function(){
        var filepath = '../fixtures/missing-commands.json';

        it('throws an error');
      });

      describe('when there is a syntax error', function(){
        var filepath = '../fixtures/syntax-error.json';

        it('throws an error');
      });
    });

    describe('when path is invalid', function(){
      it('throws an error');
    });
  });
});
