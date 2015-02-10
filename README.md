# Gunter
[![Build Status](https://img.shields.io/travis/500px/gunter.svg?style=flat-square)](https://travis-ci.org/500px/gunter)
[![Dependencies](https://img.shields.io/david/500px/gunter.svg?style=flat-square)](https://david-dm.org/500px/gunter)

![Gunter](gunter.png)

Wenk.

Language agnostic task wrapper and loyal servant.  Runs arbitrary shell commands
in an arbitrary working directory on an arbitrary server.

## Usage

Gunter requires you to define a set of tasks, represented as JSON, which tell
Gunter what commands to run, and where to run them.

Install gunter:
```sh
$ npm install gunter --save
```

Then `require` gunter in your modules:
```js
var gunter = require('gunter');
```

## Defining Tasks

Tasks are represented as JSON objects, taking the form:
```json
{
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
```
Notice the [mustache-style](http://mustache.github.io/) variable.  This is
filled in at execution time by a `vars` object passed to the `exec` function.

+ `remote` tells Gunter where to execute.  This can be either `localhost`, or
  some arbitrary server.  **Note** that Gunter is currently limited to
  connecting to a remote through `ssh-agent`, and expects a definition of the
  form `user@example.host.com`
+ `cwd` tells Gunter what directory to execute commands in
+ `commands` is an array of commands to execute.  At run time, these will be
  concatenated together with `&&`s in the order in which you define them in
  the array.

## API

Gunter is a simple penguin.  Gunter only knows how to do a few things.

### .load(tasks)

Load tasks for execution.  Evaluates tasks for proper syntax, and will throw
an error if anything is ill-defined.  You can call `load` several times, and it
will append tasks to the list of previously defined tasks.

**Note:** Gunter makes use of a global variable to keep track of its defined
tasks, `global.taskList`.  If you overwrite this global, Gunter will become
confused and break.

#### tasks

Type: `Object` or `String`

You can pass `load` either an Object, or the path to a JSON file containing
tasks like the example in [Defining Tasks](#defining-tasks). If passing `load`
a filepath, its best that you use an absolute path for simplicity, as relative
paths may not behave as you expect.

### .clear()

Clears all previously defined tasks from memory.

### .exec(taskname[, vars])

The meat and potatoes.  Executes a task.  `exec` is asynchronous, and will emit
`end` events whenever a task is completed, and `stdout` events whenever the
shell surfaces some data.  You should make use of the `emitter` object to
capture these events.

#### taskname

Type: `String`

The name of the task to execute, as defined in a previously loaded JSON object.

#### vars

Type: `Object` or `String`

This optional parameter is for filling in variables defined in previously loaded
JSON tasks.  Like `load`, it accepts either an Object or the path to a JSON
file.  Here you should pass in keys matching the variable names in your tasks,
and values containing what they should be replaced by.

Example:
```js
{
  "name" : "Gunter",
  "description" : "Wenk"
}
```

### .emitter

An `EventEmitter` object used by `exec` to asynchronously communicate its state.

When `exec` executes a task, it will emit `end` events whenever a task is
completed successfully.  You can capture these events in your module like this:
```js
gunter.emitter.on('end', function() {
  // The task has been completed successfully
  console.log('Task complete!  Hooray!');
});
```

Gunter also captures and emits all `stdout` from running tasks.  This can be a
little noisy, so its best to save this for some kind of verbose mode in your
module.  You can access it like this:
```js
gunter.emitter.on('stdout', function(data) {
  // Something's been spit out to stdout
  console.log(data);
});
```


To learn more about how events work, check out
[this tutorial](https://github.com/maxogden/art-of-node#events).

## Dependencies

+ ShellJS for running local commands
+ SSH2 for running remote commands
+ Lo-Dash for not hating my life
