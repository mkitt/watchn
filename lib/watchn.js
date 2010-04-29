(function () {
  var Watchn,
      fs = require('fs'),
      sys = require('sys'),
      VERSION = '0.0.2',
      watched = [];

  function dirtyRecurseDirs(dir) {
    var files = fs.readdirSync(dir),
        globs = [];
        
    for (var i = 0, len = files.length; i < len; i += 1) {
      var filename = dir + '/' + files[i];
      if (fs.statSync(filename).isFile()) {
        globs.push(filename);  
      } else if (fs.statSync(filename).isDirectory()) {
        var subfiles = dirtyRecurseDirs(filename);
        subfiles.forEach(function (result) {
          globs.push(result);
        });
      }
    }
    return globs;
  }
  
  function dirtyGlob(pattern) {
    if (fs.statSync(pattern).isFile()) {
      return [pattern];
    } else if (fs.statSync(pattern).isDirectory()) {  
      return dirtyRecurseDirs(pattern);
    } else {
      return [];
    }
  }

  function help() {
    var msg = 'Usage Information => ' + VERSION;
    sys.puts(msg);
  }
  
  function notify(msg, callback) {
    callback(msg);
  }
  
  function watch(pattern, callback) {
    var globs = dirtyGlob(pattern);
    for (var i = 0, len = globs.length; i < len; i += 1) {
      var file = globs[i];
      fs.watchFile(file, {persistent: true, interval: 0}, function (curr, prev) {
        if (curr.mtime > prev.mtime) {
          callback(curr, prev, file);
        }
      });
      watched.push(file);
    }
  }
  
  function kill() {
    for (var i = 0, len = watched.length; i < len; i += 1) {
      fs.unwatchFile(watched[i]);
    }
    watched.length = 0;
  }
  
  function globbed(pattern) {
    return dirtyGlob(pattern);
  }
  
  Watchn = function Watchn() {
    
  };
  
  Watchn.help = help;
  Watchn.notify = notify;
  Watchn.watch = watch;
  Watchn.kill = kill;
  Watchn.globbed = globbed;
  
  // Hook into Node's module system.
  if (typeof module !== 'undefined') {
    module.exports = Watchn;
  }

}());
