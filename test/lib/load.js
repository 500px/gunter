var should = require('should');
var load = require('../../lib/load');

describe('load', function(){
  beforeEach(function(){
    taskList = {}
  })

  describe('when passed a JSON object', function(){
    describe('when JSON is valid', function(){
      var tasks = {
        "taskname" : {
          "remote" : "localhost",
          "cwd" : "/",
          "commands" : [
            "echo I'm a task!",
            "echo I'm another task!",
            "echo Hello, my name is {{name}}"
          ]
        }
      }

      it('adds the tasks to the global taskList', function(){
        load(tasks)
        taskList.should.containEql({
          "taskname" : {
            "remote" : "localhost",
            "cwd" : "/",
            "commands" : [
              "echo I'm a task!",
              "echo I'm another task!",
              "echo Hello, my name is {{name}}"
            ]
          }
        });
      });
    });

    describe('when JSON is missing remote', function(){
      var tasks = {
        "taskname" : {
          "cwd" : "/",
          "commands" : [
            "echo I'm a task!",
            "echo I'm another task!",
            "echo Hello, my name is {{name}}"
          ]
        }
      }

      it('throws an error', function(){
        load.bind(null, tasks).should.throw();
      });
    });

    describe('when JSON is missing cwd', function(){
      var tasks = {
        "taskname" : {
          "remote" : "localhost",
          "commands" : [
            "echo I'm a task!",
            "echo I'm another task!",
            "echo Hello, my name is {{name}}"
          ]
        }
      }

      it('throws an error', function(){
        load.bind(null, tasks).should.throw();
      });
    });

    describe('when JSON is missing commands', function(){
      var tasks = {
        "taskname" : {
          "remote" : "localhost",
          "cwd" : "/"
        }
      }

      it('throws an error', function(){
        load.bind(null, tasks).should.throw();
      });
    });
  });

  describe('when passed a file path', function(){
    describe('when path leads to JSON file', function(){
      describe('when JSON is valid', function(){
        var filepath = '../fixtures/valid.json';

        it('adds the tasks to the global taskList', function(){
          load(filepath)
          taskList.should.containEql({
            "taskname" : {
              "remote" : "localhost",
              "cwd" : "/",
              "commands" : [
                "echo I'm a task!",
                "echo I'm another task!",
                "echo Hello, my name is {{name}}"
              ]
            }
          });
        });
      });

      describe('when JSON is missing remote', function(){
        var filepath = '../fixtures/missing-remote.json';

        it('throws an error', function(){
          load.bind(null, filepath).should.throw();
        });
      });

      describe('when JSON is missing cwd', function(){
        var filepath = '../fixtures/missing-cwd.json';

        it('throws an error', function(){
          load.bind(null, filepath).should.throw();
        });
      });

      describe('when JSON is missing commands', function(){
        var filepath = '../fixtures/missing-commands.json';

        it('throws an error', function(){
          load.bind(null, filepath).should.throw();
        });
      });
    });

    describe('when path is invalid', function(){
      it('throws an error', function(){
        load.bind(null, 'wenk').should.throw();
      });
    });
  });
});
