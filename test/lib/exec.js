var should = require('should');
var exec = require('../../lib/exec');
var emitter = require('../../lib/emitter');

describe('exec', function(){
  beforeEach(function(){
    global.taskList = {
      task: {
        remote: "localhost",
        cwd: ".",
        commands: [
          "echo {{cool}}!"
        ]
      }
    };
  });

  afterEach(function(){
    emitter.removeAllListeners();
  });

  describe('name', function(){
    describe('when name is not a String', function(){
      it('returns an error', function(){
        exec(1, null, {}, function(err, task){
          err.should.not.be.null;
        });
      });
    });

    describe('when name is an empty String', function(){
      it('returns an error', function(){
        exec('', null, {}, function(err, task){
          err.should.not.be.null;
        });
      });
    });

    describe('when name is well formed', function(){
      describe('when task is not defined', function(){
        it('returns an error', function(){
          exec('wenk', null, {}, function(err, task){
            err.should.not.be.null;
          });
        });
      });

      describe('when task is defined', function(){
        describe('when remote is localhost', function(){
          it('executes locally', function(){
            exec('task', null, {}, function(err, task) {
              task.should.not.be.empty.and.containEql({ commands: [ 'echo {{cool}}!' ], cwd: '.', remote: 'localhost' });
            });
          });
        });

        xdescribe('when remote is some server', function(){
          beforeEach(function(){
            global.taskList = {
              task: {
                remote: "root@127.0.0.1",
                cwd: "../test",
                commands: [
                  "echo {{cool}}!"
                ]
              }
            };
          });

          // Connection refused, I should find a way to stub this
          it('executes the commands on the server', function(){
            exec('task', null, {}, function(err, task){
              task.should.not.be.empty.and.containEql({ commands: [ 'echo {{cool}}!' ], cwd: '.', remote: 'localhost' });
            });
          });
        });
      });
    });
  });

  describe('when passed vars', function(){
    describe('when vars are an Object', function(){
      describe('when vars match variables in the task', function(){
        it('replaces the variables with values in var', function(){
          exec('task', null, { cool: 'fool' }, function(err, task) {
            task.should.not.be.empty.and.containEql({ commands: [ 'echo fool!' ], cwd: '.', remote: 'localhost' });
          });
        });
      });

      describe('when vars does not match variables in the task', function() {
        it('executes normally', function(){
          exec('task', null, { wenk: 'wenk' }, function(err, task) {
            task.should.not.be.empty.and.containEql({ commands: [ 'echo {{cool}}!' ], cwd: '.', remote: 'localhost' });
          });
        });
      });
    });

    describe('when vars are a String path', function(){
      describe('when the path is valid', function(){
        describe('when vars match variables in the task', function(){
          it('replaces the variables with values in file', function(){
            var filepath = '../../test/fixtures/exec/valid-vars.json';
            exec('task', null, filepath, function(err, task) {
              task.should.not.be.empty.and.eql({ commands: [ 'echo fool!' ], cwd: '.', remote: 'localhost' });
            });
          });
        });
      });

      describe('when the path is invalid', function(){
        it('returns an error', function(){
          exec('task', null, 'wenk', function(err, task) {
            err.should.not.be.null;
          });
        });
      });
    });

    describe('when vars are neither an Object nor a String path', function(){
      it('returns an error', function(){
        exec('task', null, 1, function(err, task) {
          err.should.not.be.null;
        });
      });
    });
  });

  describe('event name', function(){
    describe('when event is a String', function(){
      it('emits on the event passed and not output', function(){
        var test = '';
        var output = '';

        emitter.on('test', function(data) {
          test = test + data;
        });

        emitter.on('output', function(data) {
          output = output + data;
        });

        exec('task', 'test', {}, function(err, task) {
          test.should.not.be.empty;
          output.should.be.empty;
        });
      });
    });

    describe('when event is null', function(){
      it('emits on the default output event', function(){
        var test = '';
        var output = '';

        emitter.on('test', function(data) {
          test = test + data;
        });

        emitter.on('output', function(data) {
          output = output + data;
        });

        exec('task', null, {}, function(err, task) {
          test.should.be.empty;
          output.should.not.be.empty;
        });
      });
    });

    describe('when event is neither a String nor null', function(){
      it('returns an error', function(){
        exec('task', 1, {}, function(err, task) {
          err.should.not.be.null;
        });
      });
    });
  });
});
