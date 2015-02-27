var should = require('should');
var exec = require('../../lib/exec');
var emitter = require('../../lib/emitter');

xdescribe('exec', function(){
  beforeEach(function(){
    global.taskList = {
      task: {
        remote: "localhost",
        cwd: ".",
        commands: [
          "echo {{cool}}!"
        ]
      }
    }
  });

  afterEach(function(){
    emitter.removeAllListeners();
  });

  describe('when passed only a name', function(){
    describe('when name is not a String', function(){
      it('throws an error', function(){
        exec.bind(null, 1).should.throw();
      });
    });

    describe('when name is an empty String', function(){
      it('throws an error', function(){
        exec.bind(null, '').should.throw();
      });
    });

    describe('when name is well formed', function(){
      describe('when task is not defined', function(){
        it('throws an error', function(){
          exec.bind(null,'wenk').should.throw();
        });
      });

      describe('when task is defined', function(){
        describe('when remote is localhost', function(){
          it('executes the commands locally', function(done){
            var out = [];

            emitter.on('stdout', function(data) {
              out.push(data);
            });

            emitter.on('end', function(){
              out.should.not.be.empty.and.containEql('{{cool}}!\n');
              done();
            });

            exec('task');
          });
        });

        describe('when remote is some server', function(){
          beforeEach(function(){
            global.taskList = {
              task: {
                remote: "root@127.0.0.1",
                cwd: "../test",
                commands: [
                  "echo {{cool}}!"
                ]
              }
            }
          });

          // Connection refused, I should find a way to stub this
          xit('executes the commands on the server', function(){
            var out = [];

            emitter.on('stdout', function(data) {
              out.push(data);
            });

            emitter.on('end', function(){
              out.should.not.be.empty.and.containEql('{{cool}}!\n');
              done();
            });

            exec('task');
          });
        });
      });
    });
  });

  describe('when passed vars', function(){
    describe('when vars are an Object', function(){
      describe('when vars match variables in the task', function(){
        it('replaces the variables with values in var', function(done){
          var out = [];

          emitter.on('stdout', function(data) {
            out.push(data);
          });

          emitter.on('end', function(){
            out.should.not.be.empty.and.containEql('fool!\n');
            done();
          });

          exec('task', { cool: 'fool' });
        });
      });
    });

    describe('when vars are a String path', function(){
      describe('when the path is valid', function(){
        describe('when vars match variables in the task', function(){
          it('replaces the variables with values in file', function(done){
            var out = [];

            emitter.on('stdout', function(data) {
              out.push(data);
            });

            emitter.on('end', function(){
              out.should.not.be.empty.and.containEql('fool!\n');
              done();
            });

            var filepath = '../../test/fixtures/exec/valid-vars.json';
            exec('task', filepath);
          });
        });
      });

      describe('when the path is invalid', function(){
        it('throws an error', function(){
          exec.bind(null, 'task', 'wenk').should.throw();
        });
      });
    });

    describe('when vars are neither an Object nor a String path', function(){
      it('throws an error', function(){
        exec.bind(null, 'task', 1).should.throw();
      });
    });
  });
});
