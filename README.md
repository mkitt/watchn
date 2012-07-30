
# watchn

Intelligently and continuously auto execute tasks on file/directory changes. Language, framework and library agnostic.

## Get It Going

    npm install watchn -g
    cd workspace/project
    watchn runner .watchn
    watchn .watchn


## More Meat

watchn aims to automate the repetitive tasks developers run throughout the day. Tasks such as running tests, generating documentation, concatenating and minifying files. You know all those tasks we hammer together inside a `Makefile`, `Rakefile`, `Cakefile`, `Jakefile` or even `Ant` (_cringe_) tasks. In fact hooking into these files is exactly what it's designed for. watchn is really an elaborate file/directory watcher and directs it's notifications into callbacks defined by the user. watchn is built to run in the background so you can write your code and don't have to leave your current window to run the build scripts or tests. watchn can be as quiet or as loud as you want it to be. It's really up to the user to define what your preference is and what watchn executes on.

watchn can associate a file change in a single directory and execute multiple tasks. Say you code your application in [CoffeeScript][coffee] and it's stored in `lib/src` and say you've put a couple of watchers on the `lib` directory for compiling [CoffeeScript][coffee], running your tests, generating documentation and concatenating and minifying the output. Saving a [CoffeeScript][coffee] file will trigger all of these tasks and you can get immediate feedback on the status of their results. 

watchn also does some fancy code reloading, so it knows when you add a file/directory, remove a file/directory, or even update the runner file you've setup to hook into your tasks.

Why use this over the built in watchers that come with most libraries? Generally if you are using various libraries together (say, [scss][sass], [coffeescript][coffee], [jasmine][jasmine], etc..) you most likely would have numerous watcher's activated, generating various output in multiple windows or background tasks. watchn combines these into one single watcher and is ready to yell at you if you get it wrong or pat you on the back when your tasks run successfully.


## Installation

    npm install watchn -g

Once watchn is installed, it will give you an executable you can access from your CLI. Run `watchn help` from the command line and it will give you some basic help information. The second part is creating your own runner file on a per project basis, which is what watchn uses to know what directories/files to watch and how to handle the callbacks when one of these items has changed. watchn can help you with this by creating a stub file:

    watchn runner .watchn

`.watchn` file can be anything your little heart desires. Put a `.` in front of it, call it `peepingtom.js` whatever floats your boat. It doesn't even have to be a `.js` file, but that's what the runner file will be written in so go absolutely nuts. The stub file includes a single watchn method based on running `make test`. This can be changed fairly easily, so take a look at "anatomy of a watchn method" for more information.

[Check out the .watchn file][.watchn] to see the runner associated with this project and the various tasks it's calling.

[Check out the annotated source files][annotated] to look under the covers.


## Anatomy of a watchn runner

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

The `watchn.watch` method passes an `id` as the first argument, this can be just about anything you like as long as there aren't any duplicate keys. It's used internally as a key to look up callbacks when a file is changed. Since it's used as a key, name it appropriately (avoid spaces etc..). The second argument is an array of directories to watch. This has to be an array if you are passing more than one directory or multiple files. If it's only a single file/directory that needs watching, watchn will convert it internally for you. The third argument is the callback function. This is triggered when a change is detected. The callback function can house whatever you want done when the file is changed. In this instance the callback is calling `watchn.execute` with some parameters. Oh man, it's about to get so much better right now. This is a convenience function for hooking into some built in `reporters` packaged on up in this puppy. Let's break this function call down:

```javascript
watchn.execute('make test', options, 'jasmine', false, true)
```
The first argument `'make test'` is just calling a task in a Makefile. This very easily could be calling `'rake test'`, `'cake test'`, `'jake test'` or shelling out directly to an external script. This argument is just getting sent through node's `child_process.exec()` method. The second argument `options` is just passing those back to watchn from the `watchn.watch` callback. The third option is the string name of the built in or custom reporter to use. See the "Built In Reporters" section for more info on the packaged `reporters`. The fourth and fifth options are for "show [growl][growl] message on success" and "show [growl][growl] message on failure" respectively. By default the success message is set to `false` and the failed [growl][growl] message is set to `true`. Don't worry, if you aren't a fan of [growl][growl] and don't have it installed, watchn won't do something stupid and install it for you. You're on your own with that one. 

If you want to handle the callbacks on your very own and not use any of the built in `reporters`, check out the sections "Custom Callbacks" and "Build Your Own Reporters".


## Built In Reporters

watchn comes packed with a slew of `reporters` for common libraries. These have been tuned for [growl][growl] notifications (if [growl][growl] messages float your boat) and outputting results of a task to the console.  Below is a list of `reporters` and the string name used in the `watchn.execute` function call:

### General

- reporter: Basic reporter that lets you know what task ran and if it passed or failed. Primarily used for simple tasks or if there isn't a reporter for a specific library
- [docco][docco]
- [uglify][uglify]

### Testing

- [expresso][expresso]
- [jasmine][jasmine]
- [jasmine_dom][jasmine_dom]
- [vows][vows]
- [jshint][jshint]

### Languages

- [coffee][coffee]
- [sass][sass]
- [scss][sass]
- [stylus][stylus]
- [haml][haml]
- [jade][jade]

Take a look at the [.watchn][.watchn] file for their usage.

## Custom Reporters

Not finding a reporter for your favorite library? Write you own and toss it somewhere in your project. Checkout an example of a [custom reporter][custom] to get an idea of what's required and it's guts. There are a couple of prerequisites for these. It needs to be postfixed with "`_reporter.js`" (i.e. `myreporter_reporter.js`). This is to hopefully avoid naming collisions. Then in your `.watchn` file for the reporter `awesomeness_reporter.js` you'd call:

```javascript
watchn.execute('make awesomeness', options, 'awesomeness', false, true)
```

Your custom reporter should follow the [example file][custom], but at the least it needs a `constructor` with a `name` and a `report` method.

You can stick this file anywhere in you're projects `cwd`, watchn will find it for you.

Sick of creating the same custom reporter for each project? Send us a pull request and we'll add it in for you. 


## Custom Callbacks

Hey **mkitt**, your concept of `reporters` sucks! I just want to do my own thing. Yep we got that. The core of watchn is really just watching files and responding to their changes. If you want to roll your own way of doing things when a file changes, you'll want to do the following in your `.watchn` file.

```javascript
watchn.watch('test', [tests, libs], function(options) {
  if (options.curr > options.prev) {
    child.exec('make test', function(error, stdout, stderr) {
      if (error !== null) {
        // better do something cause it failed
      } else {
        // it worked!!
      }
    })
  }
})
```
Ignoring the `watchn.watch` line (we covered that already). The first conditional checks if the file has been actually changed:

```javascript
if (options.curr > options.prev) {
  // block not shown...
}
```

After that, you can run your task (most likely shelling out), grab a beer, smoke a dugan, or do whatever makes you happy. The callback is really just telling you a file changed, now what? is totally up to you. 


## Notifications

watchn likes to tell you stuff. How it's day went, who took the drunk guy home from the bar last night, if [Jennifer Aniston](http://www.google.com/search?q=jennifer+aniston&hl=en&prmd=imvnsuol&tbm=isch&tbo=u&source=univ&sa=X&ei=uEV0ToqqGcThiALF-5WzAg&ved=0CFgQsAQ&biw=1517&bih=943) is pregnant or not. Don't worry though you don't have to listen, that is unless you want to. By default watchn outputs a bunch of stuff to your console. Did the test pass, did it generate the file, did it fail, what was the stack trace? watchn will tell you. It also checks if you have [growl][growl] installed and can optionally send these messages to you if you opt in. You'll enable [growl][growl] manually from your `.watchn` file. Remember from above, if it passes, we don't care and nothing will [growl][growl], if it fails though, watchn by default will [growl][growl] this message. Override that by passing `false` to both parameters in the `watchn.execute` parameters and [growl][growl] will shut up. Of course if you don't have [growl][growl] installed, watchn won't care and do something stupid like "install it for you". If you could care less, either background the process or start watchn in silent mode: `watchn -s .watchn`. Want to hear everything? Make sure both of those parameters are set to `true` and watchn will it [growl][growl] it for you. 

Don't have [growl][growl] installed? Try

    brew install growlnotify


## CLI Options

watchn packs up some helper methods for you. It can generate a default `.watchn` runner file, stub out some `watchn.watch` and `watchn.execute` methods for specific `reporters`. Just run `watchn help` to get the list below.

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
      watchn -t vows              Outputs a watch method for vows to stdout

## Todo

- Utility method for finding files based on filetype for watchn
- Figure out how to broadcast a message when watchn crashes
- Remove [growl][growl]
- GH Pages site
- Peer review
- Upgrade to new node version
- Add compass to the reporters?
- Test out mocha
- Add travis CI
- Finish notes


## Inspiration

Loosely based on [mynyml's fabulous watchr for ruby](http://mynyml.com/ruby/flexible-continuous-testing)


## Contributing

Please do. watchn is in active development and encourages additions, changes and bug fixes. File an issue or send us a pull request and we'll happily get it in. Thanks in advance!!


## License

[The MIT License][license]

<!-- Links! -->
[.watchn]: https://github.com/mkitt/watchn/blob/master/.watchn
[license]: https://github.com/mkitt/watchn/blob/master/LICENSE.md
[custom]: https://github.com/mkitt/watchn/blob/master/examples/custom-reporter/custom_reporter.js
[annotated]: http://mkitt.github.com/watchn/
[docco]: http://jashkenas.github.com/docco/
[uglify]: https://github.com/mishoo/UglifyJS
[expresso]: http://visionmedia.github.com/expresso/
[jasmine]: https://github.com/mhevery/jasmine-node/
[jasmine_dom]: https://github.com/andrewpmckenzie/node-jasmine-dom
[jshint]: https://github.com/jshint/node-jshint
[vows]: http://vowsjs.org/
[coffee]: http://jashkenas.github.com/coffee-script/
[sass]: http://sass-lang.com/
[stylus]: http://learnboost.github.com/stylus/docs/js.html
[haml]: http://haml-lang.com/
[jade]: http://jade-lang.com/
[growl]: http://growl.info/

