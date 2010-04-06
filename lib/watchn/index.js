var fs = require('fs'),
    sys = require('sys');

var VERSION = '0.0.1';
var watched = [];

(function() {
//  sys.puts('initialization?');
})();

exports.help = function() {
  var msg = 'Usage Information! => ' + VERSION;
  sys.debug(msg);
};

exports.watch = function(pattern, callback) {
  var globs = dirtyGlob(pattern);
  for(var i = 0, len = globs.length; i < len; ++i) {
    fs.watchFile(globs[i], {persistent: true, interval: 0}, function(curr, prev) {
      callback(curr, prev);
    });
    watched.push(globs[i]);
  }
};

exports.kill = function() {
  for(var i = 0, len = watched.length; i < len; ++i) {
      fs.unwatchFile(watched[i]);
  }
  watched.length = 0;
};

exports.notify = function(msg, callback) {
  callback(msg);
};

exports.globbed = function(pattern) {
  return dirtyGlob(pattern);
};

// TODO: This should be pattern matching using RegEx...
function dirtyGlob(pattern) {
  if(fs.statSync(pattern).isFile()) {
    return [pattern];
  } else if (fs.statSync(pattern).isDirectory()) {
    return dirtyRecurseDirs(pattern);
  } else {
    return [];
  }
}

// TODO: Same here with RegEx, also should we be blocking with synchronous calls?
function dirtyRecurseDirs(dir) {
  var files = fs.readdirSync(dir);
  var globs = [];

  for(var i = 0, len = files.length; i < len; ++i) {
    var filename = dir + '/' + files[i];
    if(fs.statSync(filename).isFile()) {
      globs.push(filename);
    } else if (fs.statSync(filename).isDirectory()) {
      var subfiles = dirtyRecurseDirs(filename);
      subfiles.forEach(function(result) {
        globs.push(result);
      });
    }
  }
  return globs;
}
