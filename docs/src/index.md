
# watchn

Intelligently and continuously auto execute targets on file/directory changes.

&nbsp;

Watchn aims to automate the repetitive tasks developers run throughout the day. Tasks such as running tests, generating documentation, concatenating and minifying files. You know all those tasks we hammer together inside a Makefile, Rakefile, Jakefile or even Ant (cringe) tasks. In fact hooking into these files is exactly what it's designed for. Watchn is really an elaborate file/directory watcher and directs it's notifications into callbacks defined by the User. Watchn is designed to run in the background so you can write your code and don't have to leave your current window to run the build scripts or tests. Watchn can be as quiet or as loud as you want it to be. It's really up to the User to define what your preference is and what watchn executes on.

## MORE INFO NEEDED

Put some stuff on how we can have a watcher on a single directory execute multiple targets and other crap!!

## Installation and Setup

There are two parts to watchn to get it setup in your project. The first is the executable you can get via npm and it's recommended to install it globally:

    npm install watchn -g

Once watchn is installed, it will give you an executable you can access from your CLI. Run `watchn -h` from the command line and it will give you some basic help information. The second part is creating your own runner file on a per project basis, which is what watchn uses to know what directories/files to watch and how to handle the callbacks when one of these items has changed. Watchn can help you with this by creating a stub file by running:

    watchn -r filename.js

`filename.js` can be anything your little heart desires. Put a `.` in front of it, call it `mesoawesome.js` whatever floats your boat. It doesn't even have to be a `.js` file, but that's what the runner file will be written in so choose wisely. The stub file includes a single watchn method based on running `make test`. This can be changed fairly easily, so take a look at "anatomy of a watch method" for more information.

## Anatomy of a Watchn Runner

Generating the watchn runner stub gives you the following:

    var exec = require('child_process').exec;
    var tests = './test/';
    var libs = './lib/';

    function notify(msg, growl) {
      console.log(msg);
      if (growl) {
        exec('growlnotify -name '+  growl.name + ' -m "' + growl.msg + '"');
      }
    }

    module.exports.init = function(watchn) {

      watchn.watch('test', [tests, libs], function(options) {
        if (options.curr > options.prev) {
          exec('make test', function(error, stdout, stderr) {
            var gmsg = watchn.trim(watchn.trimANSI(stderr));

            if (error !== null) {
              gmsg = 'Test ' + gmsg.substr(gmsg.search(/(failures)/i));
              notify(stderr, {name: 'Expresso', msg: gmsg});

            } else {
              var cmsg = watchn.trim(watchn.trimNewlines(stderr));
              notify(cmsg, {name: 'Expresso', msg: gmsg + ' passed'});
            }
          });
        }
      });
    };

Let's break it down:

    var exec = require('child_process').exec;
    var tests = './test/';
    var libs = './lib/';

The only really important one here is `var exec = require('child_process').exec`. It allows us to execute child processes within watchn's callbacks. The `tests` and `libs` variables are just paths to common directories, these look familiar right? Note, watchn will try and normalize paths, and bark at you if it can't. 

    function notify(msg, growl) {
      console.log(msg);
      if (growl) {
        exec('growlnotify -name '+  growl.name + ' -m "' + growl.msg + '"');
      }
    }
This is an internal function generally used to output results from an executed callback. It's definitely not required. I tend to like having growl messages show up when a task fails, since watchn is running in another tab in my terminal, and just output success results via a `console.log()` call. If you want growl running, you'll need to install that yourself.

    module.exports.init = function(watchn) {

      watchn.watch('test', [tests, libs], function(options) {
        // body not shown
      });
    };

The `module.exports.init = function(watchn)` method is required, and this should house various `watchn.watch` callbacks. An instance of `watchn` will be passed into this function at initialization. The internal workings of a `watchn.watch` method are coming up..

## Anatomy of a Watch Method

The core of what you'll need to write resides in each of these `watchn.watch` methods. Here's an example for one to execute tests when files within the `tests` and `libs` directory change.

      watchn.watch('test', [tests, libs], function(options) {
        if (options.curr > options.prev) {
          exec('make test', function(error, stdout, stderr) {
            var gmsg = watchn.trim(watchn.trimANSI(stderr));

            if (error !== null) {
              gmsg = 'Test ' + gmsg.substr(gmsg.search(/(failures)/i));
              notify(stderr, {name: 'Expresso', msg: gmsg});

            } else {
              var cmsg = watchn.trim(watchn.trimNewlines(stderr));
              notify(cmsg, {name: 'Expresso', msg: gmsg + ' passed'});
            }
          });
        }
      });

In the first line

      watchn.watch('test', [tests, libs], function(options) {

The first parameter `'test'` is an id used internally to categorize the target to execute the callbacks on. The second parameter is an array of directories/files to watch. This doesn't have to be an array, but it will converted to one internally anyhow. The third parameter is the callback to execute when one of these directories/files changes.
