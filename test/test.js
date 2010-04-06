require.paths.push('./lib');

var fs = require('fs'),
    assert = require('assert'),
    sys = require('sys');
    watchn = require('watchn');

(function() {

  var log = [];
  var comment = '// Do not edit. File is overwritten for unit tests! => ';
  var asserts = 0;
  var failed = 0;
  var started = 0;
  var elapsed = 0;
  var funcs = [
    should_notify_generic_message,
    should_watch_file_for_change,
    should_watch_dirs_for_changes,
    reporter
  ];
  var flen = funcs.length;
  var ansi = {
    green: '\033[32m',
    red: '\033[31m',
    none: '\033[0m'
  };

  function init() {
    sys.puts('Started');
    start = Number(new Date);
    next();
  }

  function next() {
    funcs.shift()();
  }

  function should_notify_generic_message() {
    watchn.notify('message', function(msg) {
      try {
        assert.equal('message', msg);
        logger(true);
      } catch(e) {
        logger(false, 'should_notify_generic_message => ' + e);
      }
    });
    next();
  }

  function should_watch_file_for_change() {
    var helper = __dirname + '/helpers/helper.js';
    watchn.watch(helper, function(curr, prev) {
      try {
        assert.notEqual(curr.mtime, prev.mtime);
        logger(true);
      } catch(e) {
        logger(false, 'should_watch_file_for_change => ' + e);
      }
      watchn.kill();
      next();
    });
    fs.writeFile(helper, comment + new Date(), function(err) {
      if(err) throw err;
    })
  }

  function should_watch_dirs_for_changes() {

    var files = [];
    var helpers = __dirname + '/helpers/nested';
    watchn.watch(helpers, function(curr, prev) {
      try {
        assert.notEqual(curr.mtime, prev.mtime);
        logger(true);
      } catch(e) {
        logger(false, 'should_watch_dirs_for_changes => ' + e);
      }
      if(files.length > 0) {
        fs.writeFile(files.shift(), comment + new Date(), function(err) {
          if(err) throw err;
        })

      } else {
        watchn.kill();
        next();
      }
    });
    files = watchn.globbed(helpers);
    fs.writeFile(files.shift(), comment + new Date(), function(err) {
      if(err) throw err;
    })
  }

  function logger(passed, e) {
    if(passed)
    {
      asserts ++;
      sys.print(ansi.green + '.' + ansi.none);
    } else {
      failed ++;
      sys.print(ansi.red + 'F' + ansi.none);
      log.push(e);
    }
  }

  function reporter() {
    elapsed = (Number(new Date) - start) / 1000;
    sys.puts('\n');
    for(var i = 0, len = log.length; i < len; ++i) {
      sys.puts(log[i]);
    }
    var tests = flen - 1;
    var tass = asserts + failed;
    var msg = (failed > 0) ? ansi.red : ansi.green;
    msg += tests + ' test' + ((tests === 1) ? '' : 's') + ', ';
    msg += tass + ' assertion' + ((tass === 1) ? '' : 's') + ', ';
    msg += failed + ' failure' + ((failed === 1) ?  '' : 's');
    msg += ansi.none;
    sys.puts('Finished in ' + elapsed + ' seconds');
    sys.puts(msg);

    process.exit(failed);
  }
  init();
})();
