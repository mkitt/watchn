
(function () {
  var watchn,
      fs = require('fs'),
      sys = require('sys'),
      spawn = require('child_process').spawn,
      caller = process.argv[1],
      pid,
      reloader,
      monitor,
      mid,
      watched = [],
      VERSION = '0.0.6';

  function noop() {}
  
  function dirtyAddGlob() {
    
  }
  
  function dirtyRecurseDirs(dir) {
    var files = fs.readdirSync(dir),
        globs = [];
        
    for (var i = 0, len = files.length; i < len; i += 1) {
      var filename = dir + '/' + files[i];
      if (fs.statSync(filename).isFile()) {
        globs.push(filename);  
      } else if (fs.statSync(filename).isDirectory()) {
        var subfiles = dirtyRecurseDirs(filename);
        for (var j = 0, jlen = subfiles.length; j < jlen; j += 1) {
          globs.push(subfiles[j]);
        }
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

  // TODO: complete this cat
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
  
  function reload(func) {
    var callback = func || reloader;
    
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
  
  function fwatch(file, callback) {
    fs.watchFile(file, {persistent: true, interval: 0}, function (curr, prev) {
      fs.stat(file, function (err, stats) {
        callback(curr, prev, file, stats);
      });
    });
  }
  
  function watch(pattern, callback) {
    var globs = dirtyGlob(pattern);    
    for (var i = 0, len = globs.length; i < len; i += 1) {
      var file = globs[i];
      fwatch(file, callback);
      watched.push({file: file, action: callback});
    }
  }
  
  // TODO: this will need to become a rule, otherwise unwatched files will be 
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
  
  function startup() {
    var stdin = process.openStdin();
    stdin.setEncoding('utf8');
    stdin.addListener('data', function (chunk) {
      if (chunk[chunk.length - 1] === "\n") {
        sys.puts('watchn reloaded\n');
        reload();
      }
    });
    sys.puts('watchn started\n');
  }
  
  function initialize(callback) {
    if (!callback) {
      throw new Error('watchn.initialize requires a callback for reload.');
    }
    reloader = callback;
    
    watch(caller, function () { 
      reload(); 
    });
    
    if (process.pid !== pid) {
      pid = process.pid;
      startup();
    }
  }

// ----------------------------------------------------------------------------  

  watchn = function watchn() {};
  watchn.help = help;
  watchn.watched = watched;
  watchn.globbed = globbed;
  watchn.kill = kill;
  watchn.reload = reload;
  watchn.action = action;
  watchn.watch = watch;
  watchn.unwatch = unwatch;
  watchn.initialize = initialize;
  
  if (typeof module !== 'undefined') {
    module.exports = watchn;
  }

}());
