(function () {
  var watchn,
      fs = require('fs'),
      sys = require('sys'),
      spawn = require('child_process').spawn,
      monitor,
      mid,
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
  
  function onDefaultStdout(data) {
    sys.print(data);
  }
  
  function onDefaultExit(code, pid) {
    sys.puts('Child process ' + pid + ' : exited with code: ' + code);
  }
  
// ----------------------------------------------------------------------------  

  function version() {
    return VERSION;
  }

  function help() {
    var msg = 'Usage Information => ' + VERSION;
    sys.puts(msg);
  }
  
  function notify(msg, callback) {
    callback(msg);
  }
  
  function action(env, program, stdout, exit) {
    var onStdout,
        onExit;
    
    if (!env) {
      throw new Error('The "env" parameter is not defined.');
    }
    
    if (!program) {
      throw new Error('The "program" parameter is not defined.');
    }
    
    onStdout = stdout || onDefaultStdout;
    onExit = exit || onDefaultExit;
    
    if (monitor && monitor.pid === mid) {
      monitor.kill('SIGTERM');
    }
    
    monitor = spawn(env, [program]);
    mid = monitor.pid;
    
    monitor.stdout.addListener('data', function (data) {
      onStdout(data);
    });
    
    monitor.stderr.addListener('data', function (data) {
      sys.print('Error: ' + data);
    });
    
    monitor.addListener('exit', function (code) {
      onExit(code, monitor.pid);
    });
    
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

// ----------------------------------------------------------------------------  

  watchn = function watchn() {
    
  };
  
  watchn.version = version;
  watchn.help = help;
  watchn.notify = notify;
  watchn.action = action;
  watchn.watch = watch;
  watchn.kill = kill;
  watchn.globbed = globbed;
  
  // Hook into Node's module system.
  if (typeof module !== 'undefined') {
    module.exports = watchn;
  }

}());
