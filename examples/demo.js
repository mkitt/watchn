
var exec = require('child_process').exec;
var tests = './test/';
var libs = './lib/';
var publics = './examples/public/';
var demo = './examples/demo.js';
var Watchn = require('../lib/watchn');
var watcher = new Watchn();


function notify(msg, growl) {
  console.log(msg);
  if (growl) {
    exec('growlnotify -name '+  growl.name + ' -m "' + growl.msg + '"');
  }
}

watcher.watch('test', [tests, libs], function(options) {
  if (options.curr > options.prev) {
    exec('make test', function(error, stdout, stderr) {
      var gmsg = watcher.trim(watcher.trimANSI(stderr));

      if (error !== null) {
        gmsg = 'Test ' + gmsg.substr(gmsg.search(/(failures)/i));
        notify(stderr, {name: 'Expresso', msg: gmsg});

      } else {
        var cmsg = watcher.trim(watcher.trimNewlines(stderr));
        notify(cmsg, {name: 'Expresso', msg: gmsg + ' passed'});
      }
    });
  }
});

watcher.watch('styles', [publics + 'stylesheets/'], function(options) {
  if (options.curr > options.prev) {
    exec('make css', function(error, stdout, stderr) {

      if (error !== null)
        notify(error.message, {name: 'Stylus', msg: 'Build Failed!'});
      else
        notify('styles generated');

    });
  }
});


// ADD A RELOAD SCRIPT!
// self.changed({curr: curr.mtime, prev: prev.mtime, item: item, stats: stats});

