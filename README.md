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

+ `remote` tells Gunter where to execute (either `localhost`, or some
  arbitrary server)
+ `cwd` tells Gunter what directory to execute commands in
+ `commands` is an array of commands to execute.  At run time, these will be
  concatenated together with `&&`s in the order in which you define them in
  the array

## Authentication

Gunter defaults to using **ssh-agent** and **agent forwarding** to autheticate
to a remote host, but you can optionally pass it a username, password and/or
path to a private key file. You can also pass in a port if you want to user
one other than `22` for some reason.

```json
{
  "taskname" : {
    "remote" : "example.com",
    "cwd"    : "/",
    "commands: [
      "echo Holla!"
    ],
    "auth"   : {
      "username"    : "dudeson",
      "port"        : 22,
      "password"    : "suP3rSekr3tp@$sw0rd",
      "privateKey"  : "path/to/private/key"
    }
  }
}
```

Note that your real password probably shouldn't contain the word "password",
no matter how creative you are with numbers and symbols.

If several forms of authentication are present, they will be tried in the
following order until one is successful:
**Password -> Private Key -> Agent**

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

### .exec(taskname, vars, callback)

The meat and potatoes.  Executes a task.  `exec` is asynchronous.  It will emit
`stdout` events whenever the shell surfaces some data, and you can pass it a
callback to handle task completion and error.  You should make use of the exported
`emitter` object to capture the `stdout` events.

#### taskname

Type: `String`

The name of the task to execute, as defined in a previously loaded JSON object.

#### vars

Type: `Object` or `String`

This parameter is for filling in variables defined in previously loaded
JSON tasks.  Like `load`, it accepts either an Object or the path to a JSON
file.  Here you should pass in keys matching the variable names in your tasks,
and values containing what they should be replaced by. If you have no variables
to replace, just pass it an empty object `{}`

Example usage:
```js
{
  "name" : "Gunter",
  "description" : "Wenk"
}
```

### callback

Type: `Function`

Here you can pass a callback function to execute when `exec` completes.  Gunter
will call this function in the idiomatic Node style: it will set the first param
to `nil` and the second to the task object on success, and will set the first
param to an error message on error.

Your callback should look something like this:
```js
function callback(err, task) {
  if (err) {
    return console.log(err);
  }

  // Do something with the task object

  console.log('Task completed successfully!');
}
```

It's a good idea to always `return` on `err`.  If you need to brush up on your
understanding of Node callbacks, take a look at
[this great tutorial](https://github.com/maxogden/art-of-node#callbacks).

### .emitter

An `EventEmitter` object used by `exec` to asynchronously communicate its state.

Gunter captures and emits all `stdout` from running tasks.  This can be a
little noisy, so its best to save this for some kind of verbose mode in your
module, or write it to a log file.  You can access it like this:
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
