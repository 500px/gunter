# Gunter
[![Build Status](https://img.shields.io/travis/500px/gunter.svg?style=flat-square)](https://travis-ci.org/500px/gunter)
[![Dependencies](https://img.shields.io/david/500px/gunter.svg?style=flat-square)](https://david-dm.org/500px/gunter)

![Gunter](gunter.png)

Wenk.

Language agnostic task wrapper and loyal servant.  Runs arbitrary shell commands
in an arbitrary working directory on an arbitrary server.

[Upgrading from 0.3.x to 0.4.x](https://github.com/500px/gunter/wiki/Upgrading-from-0.3.x-to-0.4.x)

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

Tasks are represented as JSON objects.  Here is a basic task:
```json
{
  "taskname" : {
    "remote" : "localhost",
    "cwd" : "/",
    "commands" : [
      "echo I'm a task!",
      "echo I'm another task!",
      "echo Hello, my name is Gunter!"
    ]
  }
}
```

+ `remote` tells Gunter where to execute (either `localhost`, or some
  arbitrary server)
+ `cwd` tells Gunter what directory to execute commands in
+ `commands` is an array of commands to execute.  At run time, these will be
  concatenated together with `&&`s in the order in which you define them in
  the array

## Variables

Take a look at this task definition:
```json
{
  "taskname" : {
    "remote" : "localhost",
    "cwd" : "/",
    "commands" : [
      "echo I'm a task!",
      "echo I'm another task!",
      "echo Hello, my name is {{name}}"
    ],
    "defaults" : {
      "name" : "Gunter"
    }
  }
}
```

There are a couple differences from the one in [Defining Tasks](#defining-tasks).
Notice the [mustache-style](http://mustache.github.io/) variable `{{name}}`.  This
is filled in at execution time by a `vars` object passed to the `exec` function.
You can also optionally include a `defaults` object in your task definition if
you'd like to have defaults set for your variables, in case you don't pass anything
in to `exec`.  Otherwise, these variables will default to an empty string.


## Authentication

Gunter supports several authentication strategies (**password**, **private key**, and
**agent auth**). You can optionally add an `auth` object to your task definitions
to specify a `username`, `password`, `privateKey`, and `port`.  If you exclude
some or all of these parameters, Gunter will use agent authentication, on port
22, and set the username to the executing user's username.

Here's an example of a task definition that includes an `auth` object:

```json
{
  "taskname"   : {
    "remote"   : "example.com",
    "cwd"      : "/",
    "commands" : [
      "echo Holla!"
    ],
    "auth"     : {
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

### .exec(taskname, event, vars, callback)

The meat and potatoes.  Executes a task.  `exec` is asynchronous.  It will emit
events against the `event` tag whenever the shell surfaces some data, and you can
pass it a callback to handle task completion and error.  You should make use of
the exported `emitter` object to capture the `stdout` events.

#### taskname

Type: `String`

The name of the task to execute, as defined in a previously loaded JSON object.

#### event

Type: `String`

Tells Gunter what event to emit on `stdout`.  If you leave this value `null`, it'll
default to emitting on the `'stdout'` event.  Make sure you set up an event listener
for the event passed here as described in [.emitter](#-emitter) below before calling
this function.

**Important note**: If you'll be running more than one task concurrently, you'll
probably want to give each a unique event you can monitor.

#### vars

Type: `Object` or `String`

This parameter is for filling in variables defined in previously loaded
JSON tasks.  Like `load`, it accepts either an Object or the path to a JSON
file.  Here you should pass in keys matching the variable names in your tasks,
and values containing what they should be replaced by. If you have no variables
to replace, just pass it an empty object `{}`.  Note that any variables you pass
in here that aren't actually defined in your task will just get eaten at runtime.

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

Gunter captures and emits all `stdout` from running tasks as a buffer.  This can
be a little noisy, so its best to save this for some kind of verbose mode in your
module, or write it to a log file.  

How you should access these events depends on how you'll be calling `exec`.  If
you're going to pass `exec` an `event`, setup a listener for that event.  If you're
not concerned about concurrency, aren't passing a value to `event`, and want
everything to report on one event, setup a listener for the default event, `'stdout'`

You can access it like this:
```js
gunter.emitter.on('eventName', function(data) {
  // Something's been spit out to stdout
  console.log(data.toString('utf8');
});
```


To learn more about how events work, check out
[this tutorial](https://github.com/maxogden/art-of-node#events).

## Dependencies

+ ShellJS for running local commands
+ SSH2 for running remote commands
+ Lo-Dash for not hating my life

## License

```
The MIT License (MIT)

Copyright (c) 2015 500px

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
