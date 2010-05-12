
(function () {
  require.paths.push('./lib');
  var fs = require('fs'),
      assert = require('assert'),
      sys = require('sys'),
      reporter = require('reporter'),
      watchn = require('watchn'),
      comment = '// Do not edit. File is overwritten for unit tests! => ';

  function noop() {}
  
  function beforeEach() {}
  
  function afterEach() {
    watchn.kill();
    reporter.next();
  }
  
// ----------------------------------------------------------------------------

  function should_do_something_simple() {
    try {
      assert.equal(true, true);
      reporter.log(true);
    } catch (e) {
      reporter.log(false, 'should_do_something_simple => ' + e);
    }
    afterEach();
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
      afterEach();
    });
    fs.writeFile(helper, comment + new Date(), function (err) {
      if (err) {
        throw err;
      }
    });
  }
  
  function should_unwatch_single_file() {
    var helper = __dirname + '/helpers/helper.js';
    
    watchn.watch(helper, function (curr, prev, file) {});
    try {
      assert.equal(watchn.watched.length, 1);
      reporter.log(true);
    } catch (e) {
      reporter.log(false, 'should_unwatch_single_file => ' + e);
    }
    
    watchn.unwatch(helper);
    try {
      assert.equal(watchn.watched.length, 0);
      reporter.log(true);
    } catch (ee) {
      reporter.log(false, 'should_unwatch_single_file => ' + ee);
    }
    afterEach();
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
        afterEach();
      }
    });
    files = watchn.globbed(helpers);
    fs.writeFile(files.shift(), comment + new Date(), function (err) {
      if (err) {
        throw err;
      }
    });
  }
  
  function should_unwatch_directory() {
    var helpers = __dirname + '/helpers/nested',
        globlen = watchn.globbed(helpers).length;
    
    watchn.watch(helpers, function (curr, prev, file) {});
    try {
      assert.equal(watchn.watched.length, globlen);
      reporter.log(true);
    } catch (e) {
      reporter.log(false, 'should_unwatch_directory => ' + e);
    }
    
    watchn.unwatch(helpers);
    try {
      assert.equal(watchn.watched.length, 0);
      reporter.log(true);
    } catch (ee) {
      reporter.log(false, 'should_unwatch_directory => ' + ee);
    }
    afterEach();
  }
  
  function should_kill_all_watched_files() {
    var helpers = __dirname + '/helpers/nested',
        globlen = watchn.globbed(helpers).length;
    
    watchn.watch(helpers, function (curr, prev, file) {});
    try {
      assert.equal(watchn.watched.length, globlen);
      reporter.log(true);
    } catch (e) {
      reporter.log(false, 'should_kill_all_watched_files => ' + e);
    }
    
    watchn.kill();
    try {
      assert.equal(watchn.watched.length, 0);
      reporter.log(true);
    } catch (ee) {
      reporter.log(false, 'should_kill_all_watched_files => ' + ee);
    }
    afterEach();
  }
  
  function should_error_on_missing_env_for_action() {
    try {
      assert.throws(function () {
        watchn.action();
      });
      reporter.log(true);
    } catch (e) {
      reporter.log(false, 'should_error_on_missing_env_for_action => ' + e);
    }
    afterEach();
  }
  
  function should_error_on_missing_program_for_action() {
    try {
      assert.throws(function () {
        watchn.action({env: 'node'});
      });
      reporter.log(true);
    } catch (e) {
      reporter.log(false, 'should_error_on_missing_program_for_action => ' + e);
    }
    afterEach();
  }
  
  function should_run_node_program() {
    var env = 'node',
        prog = __dirname + '/helpers/noder.js',
        exit = function (code) {
          assert.equal(code, 0);
        };
        
    try {
      watchn.action({env: env, program: prog, exit: exit});
      reporter.log(true);
    } catch (e) {
      reporter.log(false, 'should_run_node_program => ' + e);
    }
    afterEach();
  }
  
  function should_run_ruby_program() {
    var env = 'ruby',
        prog = __dirname + '/helpers/ruby.rb',
        exit = function (code) {
          assert.equal(code, 0);
        };
        
    try {
      watchn.action({env: env, program: prog, exit: exit});
      reporter.log(true);
    } catch (e) {
      reporter.log(false, 'should_run_ruby_program => ' + e);
    }
    afterEach();
  }
  
  function should_watch_new_file_added() {
    var helpers = __dirname + '/helpers/nested',
        globlen = watchn.globbed(helpers).length,
        added = __dirname + '/helpers/nested/temp_helper.js',
        watchit = function () {
          watchn.watch(helpers, function (curr, prev, file) {});
        };
    
    watchn.watch(helpers, function (curr, prev, file) {});
    try {
      assert.equal(watchn.watched.length, globlen);
      reporter.log(true);
    } catch (e) {
      reporter.log(false, 'should_watch_new_file_added => ' + e);
    }
    
    fs.openSync(added, 'w+');
    
    watchn.reload(watchit);
    try {
      assert.equal(watchn.watched.length, globlen + 1);
      reporter.log(true);
    } catch (ee) {
      reporter.log(false, 'should_watch_new_file_added => ' + ee);
    }
    
    fs.unlinkSync(added);
    afterEach();
  }
  
  function should_watch_new_file_added_then_deleted() {
    var helpers = __dirname + '/helpers/nested',
        globlen = watchn.globbed(helpers).length,
        added = __dirname + '/helpers/nested/temp_helper.js',
        watchit = function () {
          watchn.watch(helpers, function (curr, prev, file) {});
        };
    
    watchn.watch(helpers, function (curr, prev, file) {});
    try {
      assert.equal(watchn.watched.length, globlen);
      reporter.log(true);
    } catch (e) {
      reporter.log(false, 'should_watch_new_file_added_then_deleted => ' + e);
    }
    
    fs.openSync(added, 'w+');
    
    watchn.reload(watchit);
    try {
      assert.equal(watchn.watched.length, globlen + 1);
      reporter.log(true);
    } catch (ee) {
      reporter.log(false, 'should_watch_new_file_added_then_deleted => ' + ee);
    }
    
    fs.unlinkSync(added);
    
    watchn.reload(watchit);
    try {
      assert.equal(watchn.watched.length, globlen);
      reporter.log(true);
    } catch (eee) {
      reporter.log(false, 'should_watch_new_file_added_then_deleted => ' + eee);
    }
    afterEach();
  }
  
// ----------------------------------------------------------------------------
  
  reporter.start([
    should_do_something_simple,
    should_watch_file_for_change,
    should_unwatch_single_file,
    should_watch_dirs_for_changes,
    should_unwatch_directory,
    should_kill_all_watched_files,
    should_error_on_missing_env_for_action,
    should_error_on_missing_program_for_action,
    should_run_node_program,
    should_run_ruby_program,
    should_watch_new_file_added,
    should_watch_new_file_added_then_deleted
  ]);
  
}());
