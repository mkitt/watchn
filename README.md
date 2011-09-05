
# watchn

Intelligently and continuously auto execute tasks on file/directory changes. File watching on steroids.

Watchn aims to automate the repetitive tasks developers run throughout the day. Tasks such as running tests, generating documentation, concatenating and minifying files. You know all those tasks we hammer together inside a Makefile, Rakefile, Jakefile or even Ant (cringe) tasks. In fact hooking into these files is exactly what it's designed for. Watchn is really an elaborate file/directory watcher and directs it's notifications into callbacks defined by the User. Watchn is designed to run in the background so you can write your code and don't have to leave your current window to run the build scripts or tests. Watchn can be as quiet or as loud as you want it to be. It's really up to the User to define what your preference is and what watchn executes on.

Watchn does some fancy code reloading, so it knows when you add a file/directory, remove a file/directory, or even update the runner file you've setup to hook into your tasks.


## Installation

    npm install watchn -g

Once watchn is installed, it will give you an executable you can access from your CLI. Run `watchn -h` from the command line and it will give you some basic help information. The second part is creating your own runner file on a per project basis, which is what watchn uses to know what directories/files to watch and how to handle the callbacks when one of these items has changed. Watchn can help you with this by creating a stub file by running:

    watchn -r .watchn

`.watchn` can be anything your little heart desires. Put a `.` in front of it, call it `peepingtom.js` whatever floats your boat. It doesn't even have to be a `.js` file, but that's what the runner file will be written in so choose wisely. The stub file includes a single watchn method based on running `make test`. This can be changed fairly easily, so take a look at "anatomy of a watchn method" for more information.

[Check out the .watchn file](https://github.com/mkitt/watchn/blob/master/.watchn) to see the runner associated with this project and the various tasks it's calling.

[Check out the annotated source files](http://mkitt.github.com/watchn/watchn.html) to look under the covers.


## Anatomy of a Watchn Runner

Generating the watchn runner stub gives you the following:

```javascript
var exec = require('child_process').exec
var tests = './test/'
var libs = './lib/'

function notify(msg, growl) {
  console.log(new Date() + ': ' + msg)
  if (growl) {
    exec('growlnotify -name '+  growl.name + ' -m "' + growl.msg + '"')
  }
}

module.exports.init = function(watchn) {

  watchn.watch('test', [tests, libs], function(options) {
    if (options.curr > options.prev) {
      exec('make test', function(error, stdout, stderr) {

        if (error !== null)
          notify(error.message, {name: 'Tests', msg: 'Tests Failed!'});
        else
          notify('tests passed');
      })
    }
  })
}
```

Let's break it down:

```javascript
var exec = require('child_process').exec
var tests = './test/'
var libs = './lib/'
```

The only really important one here is `var exec = require('child_process').exec`. It allows us to execute child processes within watchn's callbacks. The `tests` and `libs` variables are just paths to common directories, these look familiar right? Note, watchn will try and normalize paths, and bark at you if it can't. 

```javascript
function notify(msg, growl) {
  console.log(new Date() + ': ' + msg)
  if (growl) {
    exec('growlnotify -name '+  growl.name + ' -m "' + growl.msg + '"')
  }
}
```

This is an internal function generally used to output results from an executed callback. It's definitely not required. I tend to like having growl messages show up when a task fails, since watchn is running in another tab in my terminal, and just output success results via a `console.log()` call. If you want growl running, you'll need to install that yourself.

```javascript
module.exports.init = function(watchn) {
  watchn.watch('test', [tests, libs], function(options) {
    // body not shown
  })
}
```

The `module.exports.init = function(watchn)` method is required, and this should house various `watchn.watch` callbacks. An instance of `watchn` will be passed into this function at initialization. The internal workings of a `watchn.watch` method are coming up..


## Anatomy of a Watch Method

The core of what you'll need to write resides in each of these `watchn.watch` methods. Here's an example for one to execute tests when files within the `tests` and `libs` directory change.

```javascript
watchn.watch('test', [tests, libs], function(options) {
  if (options.curr > options.prev) {
    exec('make test', function(error, stdout, stderr) {

      if (error !== null)
        notify(error.message, {name: 'Tests', msg: 'Tests Failed!'});
      else
        notify('tests passed');
    })
  }
})
```
In the first line

      watchn.watch('test', [tests, libs], function(options) {

The first parameter `'test'` is an id used internally to categorize the target to execute the callbacks on. The second parameter is an array of directories/files to watch. This doesn't have to be an array, but it will be converted to one internally. The third parameter is the callback to execute when one of these directories/files changes. Here we are calling `make test` which executes the `test` task in the `Makefile`. This could be anything, a rake task, ant task, or just shell out to an executable. Go nuts.


## CLI Options

    Usage:
      watchn [options] <program>

    Program <required>:
      <program>                   The runner program to respond to watched items

    Options [optional]:
      -h, --help                  Output help information
      -v, --version               Output the current version
      -s, --silent                Quiet watchn except for errors
      -r, --runner <name>         Basic stub for a new runner file
      -t, --template <name>       Generate a watchn.watch method for a program type
      -l, --list-templates        List available template arguments for generation

    Examples:
      watchn .watchn              Starts watchn with an existing runner file
      watchn -s .watchn           Starts watchn in quiet mode with a runner file
      watchn -r .watchn           Generates a default runner file
      watchn -t stylus            Outputs a watch method for stylus to stdout
      watchn -t scss              Outputs a watch method for scss to stdout
      watchn -t jade              Outputs a watch method for jade to stdout
      watchn -t haml              Outputs a watch method for haml to stdout
      watchn -t expresso          Outputs a watch method for expresso to stdout
      watchn -t docco             Outputs a watch method for docco to stdout
      watchn -l                   Lists available templates for various libraries

## Todo

- Simple Reporters for templates
- `watchn` is doing to much
- Add jasmine-node
- Add jasmine-dom
- Add jshint
- Add vows
- Add uglify
- Add patterns to documentation and move to a reporters file
- `console.log(new Date().toTimeString() + ': ' + msg)`
- return `this` on all public methods for chaining
- Utility method for finding files based on filetype
- Peer review


## Inspiration

Loosely based on [mynyml's fabulous watchr for ruby](http://mynyml.com/ruby/flexible-continuous-testing)


## License

(The MIT License)

Copyright (c) 2011 Matthew Kitt

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

