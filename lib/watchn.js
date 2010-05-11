
(function () {
  var watchn,
      fs = require('fs'),
      sys = require('sys'),
      spawn = require('child_process').spawn,
      caller = process.argv[1],
      handler,
      monitor,
      mid,
      watched = [],
      VERSION = '0.0.4';

  function noop() {}
  
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
  
// ----------------------------------------------------------------------------  

  // todo: complete this cat
  function help() {
    var msg = 'Usage Information => ' + VERSION;
    sys.puts(msg);
  }
  
  function globbed(pattern) {
    return dirtyGlob(pattern);
  }
  
  function kill() {
    for (var i = 0, len = watched.length; i < len; i += 1) {
      fs.unwatchFile(watched[i].file);
    }
    watched.length = 0;
  }
  
  // todo: do we need to throw an error if there is no handler defined?
  function reload(func) {
    var callback = func || handler;
    
    if (callback) {
      kill();
      callback();
    }
  }
  
  function action(options) {
    var env = options.env,
        program = options.program,
        onstdout,
        onexit;
    
    if (!env) {
      throw new Error('The "options.env" is not defined.');
    }
    
    if (!program) {
      throw new Error('The "options.program" is not defined.');
    }
    
    onstdout = options.stdout || noop;
    onexit = options.exit || noop;
    
    if (monitor && monitor.pid === mid) {
      monitor.kill('SIGTERM');
    }
    
    monitor = spawn(env, [program]);
    mid = monitor.pid;
    
    monitor.stdout.addListener('data', function (data) {
      onstdout(data);
    });
    
    monitor.stderr.addListener('data', function (data) {
      sys.debug('Error: ' + data);
    });
    
    monitor.addListener('exit', function (code) {
      onexit(code);
    });
    
  }
  
  function watch(pattern, callback) {
    var globs = dirtyGlob(pattern);
    
    for (var i = 0, len = globs.length; i < len; i += 1) {
      var file = globs[i];
            
      fs.watchFile(file, {persistent: true, interval: 0}, function (curr, prev) {
        if (curr.mtime > prev.mtime) {
          if (file !== caller) {
            reload();
          }
          callback(curr, prev, file);
        }
      });
      watched.push({file: file, action: callback});
    }
  }
  
  // todo: this will need to become a rule, otherwise unwatched files will be 
  // re-added after the reload is called.
  function unwatch(pattern) {
    var globs = dirtyGlob(pattern);
    
    for (var i = 0, len = globs.length; i < len; i += 1) {
      var file = globs[i];
      for (var j = 0, jlen = watched.length; j < jlen; j += 1) {
        try {
          var wfile = watched[j].file;
          if (watched[j].file === file) {
            fs.unwatchFile(file);
            watched.splice(j, 1);
          }
        } catch (e) {}
      }
    }
  }
  
  function initialize(callback) {
    if (!callback) {
      throw new Error('watchn.initialize requires a callback.');
    }
    
    handler = callback;
    watch(caller, function () { 
      reload(); 
    });
    sys.puts('watchn initialized\n');
  }

// ----------------------------------------------------------------------------  

  watchn = function watchn() {};
  watchn.help = help;
  watchn.watched = watched;
  watchn.globbed = globbed;
  watchn.action = action;
  watchn.watch = watch;
  watchn.unwatch = unwatch;
  watchn.kill = kill;
  watchn.reload = reload;
  watchn.initialize = initialize;
  
  if (typeof module !== 'undefined') {
    module.exports = watchn;
  }

}());
