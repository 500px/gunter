# Gunter [![Build Status](https://magnum.travis-ci.com/500px/gunter.svg?token=xbayY4WQuW55u1swFMoe&branch=master)](https://magnum.travis-ci.com/500px/gunter)

![Gunter](gunter.png)

Wenk.

Language agnostic task wrapper and loyal servant.  Runs arbitrary shell commands
in an arbitrary working directory on an arbitrary server.

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

## API

Gunter is a simple penguin.  Gunter only knows how to do a few things.

### .load(tasks)

Load tasks for execution.  Evaluates tasks for proper syntax, and will throw
an error if anything is ill-defined.  You can call `load` several times, and it
will append tasks to the list of previously defined tasks.

#### tasks

Type: `Object` or `String`

You can pass it either an Object, or the path to a JSON file.

### .clear()

Clears all previously defined tasks from memory.

### .exec(taskname[, vars])

The meat and potatoes.  Executes a task.

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

## Dependencies

+ ShellJS for running local commands
+ Sequest for running remote commands
+ Lo-Dash for not hating my life
