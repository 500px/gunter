# Gunter

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
filled in at execution time by a variables object passed to the `exec` function.

## API

Gunter is a simple penguin.  Gunter only knows how to do a few things.

### .load(json)

Load tasks for execution.  Evaluates tasks for proper syntax, and will throw
an error if anything is ill-defined.  You can call `load` several times, and it
will append tasks to the list of previously defined tasks.

#### json

Type: `JSON Object` or `JSON File`

You can pass it either a JSON object, or the absolute path to a JSON file.

### .clear()

Clears all previously defined tasks from memory.

### .exec(taskname[, vars])

The meat and potatoes.  Executes a task.

#### taskname

Type: `String`

The name of the task to execute, as defined in a previously loaded JSON object.

#### vars

Type: `JSON Object` or `JSON File`

This optional parameter is for filling in variables defined in previously loaded
JSON tasks.  Like `load`, it accepts either a JSON object or the absolute path
to a JSON file.  Here you should pass in JSON containing keys matching the
variable names in your tasks, and values containing what they should be replaced
by.

Example:
```json
{
  "name" : "Gunter",
  "description" : "Wenk"
}
```

## Dependencies

+ ShellJS for running local commands
+ Sequest for running remote commands
+ Lodash for not hating my life
