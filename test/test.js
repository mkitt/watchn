(function () {
  require.paths.push('./lib');
  var fs = require('fs'),
      assert = require('assert'),
      sys = require('sys'),
      reporter = require('reporter'),
      watchn = require('watchn'),
      comment = '// Do not edit. File is overwritten for unit tests! => ';

// ----------------------------------------------------------------------------

  function should_notify_generic_message() {
    watchn.notify('message', function (msg) {
      try {
        assert.equal('message', msg);
        reporter.log(true);
      } catch (e) {
        reporter.log(false, 'should_notify_generic_message => ' + e);
      }
    });
    reporter.next();
  }

  function should_watch_file_for_change() {
    var helper = __dirname + '/helpers/helper.js';
    
    watchn.watch(helper, function (curr, prev) {
      try {
        assert.notEqual(curr.mtime, prev.mtime);
        reporter.log(true);
      } catch (e) {
        reporter.log(false, 'should_watch_file_for_change => ' + e);
      }
      watchn.kill();
      reporter.next();
    });
    fs.writeFile(helper, comment + new Date(), function (err) {
      if (err) {
        throw err;
      }
    });
  }

  function should_watch_dirs_for_changes() {
    var files = [],
    helpers = __dirname + '/helpers/nested';
    
    watchn.watch(helpers, function (curr, prev) {
      try {
        assert.notEqual(curr.mtime, prev.mtime);
        reporter.log(true);
      } catch (e) {
        reporter.log(false, 'should_watch_dirs_for_changes => ' + e);
      }
      if (files.length > 0) {
        fs.writeFile(files.shift(), comment + new Date(), function (err) {
          if (err) {
            throw err;
          }
        });

      } else {
        watchn.kill();
        reporter.next();
      }
    });
    files = watchn.globbed(helpers);
    fs.writeFile(files.shift(), comment + new Date(), function (err) {
      if (err) {
        throw err;
      }
    });
  }
  
// ----------------------------------------------------------------------------
  
  reporter.start([
    should_notify_generic_message,
    should_watch_file_for_change,
    should_watch_dirs_for_changes
  ]);
  
}());
