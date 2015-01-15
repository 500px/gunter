var should = require('should');
var load = require('../../lib/load');

describe('load', function(){
  beforeEach(function(){
    taskList = {}
  })

  describe('when passed an object', function(){
    describe('when object is valid', function(){
      var tasks = {
        taskname: {
          remote: "localhost",
          cwd: "/",
          commands: [
            "echo I'm a task!",
            "echo I'm another task!",
            "echo Hello, my name is {{name}}"
          ]
        }
      }

      it('adds the tasks to the global taskList', function(){
        load(tasks)
        taskList.should.containEql({
          taskname: {
            remote: "localhost",
            cwd: "/",
            commands: [
              "echo I'm a task!",
              "echo I'm another task!",
              "echo Hello, my name is {{name}}"
            ]
          }
        });
      });
    });

    describe('when object is missing remote', function(){
      var tasks = {
        taskname: {
          cwd: "/",
          commands: [
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

    describe('when object is missing cwd', function(){
      var tasks = {
        taskname: {
          remote: "localhost",
          commands: [
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

    describe('when object is missing commands', function(){
      var tasks = {
        taskname: {
          remote: "localhost",
          cwd: "/"
        }
      }

      it('throws an error', function(){
        load.bind(null, tasks).should.throw();
      });
    });

    describe('when there are multiple tasks', function() {
      describe('when object is valid', function(){
        var tasks = {
          task1: {
            remote: "localhost",
            cwd: "/",
            commands: [
              "echo I'm a task!",
              "echo I'm another task!",
              "echo Hello, my name is {{name}}"
            ]
          },
          task2: {
            remote: "localhost",
            cwd: "/",
            commands: [
              "echo I'm a task!",
              "echo I'm another task!",
              "echo Hello, my name is {{name}}"
            ]
          }
        }

        it('adds the tasks to the global taskList', function(){
          load(tasks)
          taskList.should.containEql({
            task1: {
              remote: "localhost",
              cwd: "/",
              commands: [
                "echo I'm a task!",
                "echo I'm another task!",
                "echo Hello, my name is {{name}}"
              ]
            },
            task2: {
              remote: "localhost",
              cwd: "/",
              commands: [
                "echo I'm a task!",
                "echo I'm another task!",
                "echo Hello, my name is {{name}}"
              ]
            }
          });
        });
      });

      describe('when object is invalid', function(){
        var tasks = {
          task1: {
            remote: "localhost",
            cwd: "/",
            commands: [
            "echo I'm a task!",
            "echo I'm another task!",
            "echo Hello, my name is {{name}}"
            ]
          },
          task2: {
            remote: "localhost",
            cwd: "/"
          }
        }

        it('throws an error', function(){
          load.bind(null, tasks).should.throw();
        });
      });
    });
  });

  describe('when passed a file path', function(){
    describe('when path leads to JSON file', function(){
      describe('when JSON is valid', function(){
        var filepath = '../test/fixtures/valid.json';

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
        var filepath = '../test/fixtures/missing-remote.json';

        it('throws an error', function(){
          load.bind(null, filepath).should.throw();
        });
      });

      describe('when JSON is missing cwd', function(){
        var filepath = '../test/fixtures/missing-cwd.json';

        it('throws an error', function(){
          load.bind(null, filepath).should.throw();
        });
      });

      describe('when JSON is missing commands', function(){
        var filepath = '../test/fixtures/missing-commands.json';

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

  describe('when passed something else', function(){
    it('throws an error', function(){
      load.bind(null, 1).should.throw();
    });
  });
});
