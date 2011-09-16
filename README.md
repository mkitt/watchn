
# watchn

Intelligently and continuously auto execute tasks on file/directory changes.

Watchn aims to automate the repetitive tasks developers run throughout the day. Tasks such as running tests, generating documentation, concatenating and minifying files. You know all those tasks we hammer together inside a Makefile, Rakefile, Cakefile, Jakefile or even Ant (_cringe_) tasks. In fact hooking into these files is exactly what it's designed for. Watchn is really an elaborate file/directory watcher and directs it's notifications into callbacks defined by the User. Watchn is built to run in the background so you can write your code and don't have to leave your current window to run the build scripts or tests. Watchn can be as quiet or as loud as you want it to be. It's really up to the User to define what your preference is and what watchn executes on.

Watchn can associate a file change in a single directory and execute multiple tasks. Say you code your application in CoffeeScript and it's stored in `lib/src` and say you've put a couple of watchers on the `lib` directory for compiling CoffeeScript, running your tests, generating documentation and concatenating and minifying the output. Saving a CoffeeScript file will trigger all of these tasks and you can get immediate feedback on the status of their results. 

Watchn also does some fancy code reloading, so it knows when you add a file/directory, remove a file/directory, or even update the runner file you've setup to hook into your tasks.

Why use this over the built in watchers that come with most libraries? Generally if you are using various libraries together (say, `scss`, `coffeescript`, `jasmine`, etc..) you most likely would have numerous watcher's activated, generating various output in multiple windows or background tasks. Watchn combines these into one single watcher and is ready to yell at you if you get it wrong or pat you on the back when your tasks run successfully.


## Installation

    npm install watchn -g

Once watchn is installed, it will give you an executable you can access from your CLI. Run `watchn help` from the command line and it will give you some basic help information. The second part is creating your own runner file on a per project basis, which is what watchn uses to know what directories/files to watch and how to handle the callbacks when one of these items has changed. Watchn can help you with this by creating a stub file by running:

    watchn runner .watchn

`.watchn` can be anything your little heart desires. Put a `.` in front of it, call it `peepingtom.js` whatever floats your boat. It doesn't even have to be a `.js` file, but that's what the runner file will be written in so go absolutely nuts. The stub file includes a single watchn method based on running `make test`. This can be changed fairly easily, so take a look at "anatomy of a watchn method" for more information.

[Check out the .watchn file](https://github.com/mkitt/watchn/blob/master/.watchn) to see the runner associated with this project and the various tasks it's calling.

[Check out the annotated source files](http://mkitt.github.com/watchn/watchn.html) to look under the covers.


## Anatomy of a Watchn Runner

Generating the watchn runner stub gives you the following:

```javascript
var tests = './test/'
var libs = './lib/'

module.exports.init = function(watchn) {

  watchn.watch('test', [tests, libs], function(options) {
    watchn.execute('make test', options, 'jasmine', false, true)
  })

}
```

Let's break it down:

```javascript
var tests = './test/'
var libs = './lib/'
```

The `tests` and `libs` variables are just paths to common directories, these look familiar right? Note, watchn will try and normalize paths, and bark at you if it can't. 

```javascript
module.exports.init = function(watchn) {

  watchn.watch('test', [tests, libs], function(options) {
    watchn.execute('make test', options, 'jasmine', false, true)
  })

}
```

The `module.exports.init = function(watchn)` method is required, and this should house various `watchn.watch` callbacks. An instance of `watchn` will be passed into this function at initialization. 

The `watchn.watch` method passes an `id` as the first argument, this can be just about anything you like as long as there aren't any duplicate keys. It's used internally as a key to look up callbacks when a file is changed. Since it's used as a key, name it appropriately (avoid spaces etc..). The second argument is an array of directories to watch. This has to be an array if you are passing more than one directory or multiple files. If it's only a single file/directory that needs watching, watchn will convert it internally for you. The third argument is the callback function. This is triggered when a change is detected. The callback function can house whatever you want done when the file is changed. In this instance the callback is calling `watchn.execute` with some parameters. Oh man, it's about to get so much better right now. This is a convenience function for hooking into some built in `reporters` packaged on up in this puppy. See the "Built In Reporters" section for more info. If you want to handle the callbacks on your very own, check out the section "Custom Callbacks".


## Built In Reporters

Watchn comes packed with a slew of `reporters` for common libraries. These have been tuned for growl notifications (if growl messages float your boat) and outputting results of a task to the console. These can be triggered in the `watchn.watch` callback with the following call:


```javascript
watchn.execute('make test', options, 'jasmine', false, true)
```
FINISH THE EXPLANATION AROUND BUILT IN REPORTERS!!!!!!!!!!!


## Custom Reporters

THIS NEEDS TO BE COMPLETED!!!!


## Custom Callbacks

THIS NEEDS TO BE REVAMPED!!

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


## Notifications

THIS NEEDS TO BE COMPLETED!!!


## CLI Options

    Usage:
      watchn [options] <program>

    Program <required>:
      <program>                   The runner program to respond to watched items

    Options [optional]:
      -h, [--]help                Output help information
      -v, [--]version             Output the current version
      -s, [--]silent              Quiet watchn except for errors
      -r, [--]runner <name>       Basic stub for a new runner file
      -t, [--]template <name>     Generate a watchn.watch method
      -l, [--]list                List available templates for generation

    Examples:
      watchn .watchn              Starts watchn with an existing runner file
      watchn -s .watchn           Starts watchn in quiet mode with a runner file
      watchn -r .watchn           Generates a default runner file named ".watchn"
      watchn -l                   Lists available templates for various libraries
      watchn -t coffee            Outputs a watch method for coffeescript to stdout
      watchn -t docco             Outputs a watch method for docco to stdout
      watchn -t expresso          Outputs a watch method for expresso to stdout
      watchn -t generic           Outputs a watch method for generic tasks to stdout
      watchn -t haml              Outputs a watch method for haml to stdout
      watchn -t jade              Outputs a watch method for jade to stdout
      watchn -t jasmine           Outputs a watch method for jasmine-node to stdout
      watchn -t jasmine_dom       Outputs a watch method for jasmine-dom to stdout
      watchn -t jshint            Outputs a watch method for jshint to stdout
      watchn -t sass              Outputs a watch method for sass to stdout
      watchn -t scss              Outputs a watch method for scss to stdout
      watchn -t stylus            Outputs a watch method for stylus to stdout
      watchn -t uglify            Outputs a watch method for uglify to stdout

## Todo

### Reporters Branch

- Add a `vows` reporter
- Cleanup Documentation and README (links!)
- Merge to master
- `npm publish`


- Utility method for finding files based on filetype for watchn
- Figure out how to broadcast a message when watchn crashes
- Test for growl executable?
- Growl Colors?
- Growl Icon
- GH Pages update
- Peer review


## Inspiration

Loosely based on [mynyml's fabulous watchr for ruby](http://mynyml.com/ruby/flexible-continuous-testing)


## Contributing


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

