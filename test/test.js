
(function () {
  require.paths.push('./lib');
  var assert = require('assertn'),
      fs = require('fs'),
      sys = require('sys'),
      watchn = require('watchn'),
      comment = '// Do not edit. File is overwritten for unit tests! => ',
      it = {};
    
  assert.beforeEach(function () {
    watchn.kill();
  });
  
  it.should_watch_file_for_change = function () {
    var helper = __dirname + '/helpers/helper.js';
    watchn.watch(helper, function (curr, prev) {
      assert.notEqual(curr.mtime, prev.mtime);
    });
    fs.writeFile(helper, comment + new Date(), function (err) {
      if (err) {
        throw err;
      }
    });
  };
    
  it.should_unwatch_single_file = function () {
      var helper = __dirname + '/helpers/helper.js';      
      watchn.watch(helper, function (curr, prev, file) {});
      assert.equal(watchn.watched.length, 1, null, true);
      watchn.unwatch(helper);
      assert.equal(watchn.watched.length, 0);
    };
        
  it.should_watch_dirs_for_changes = function () {
    var files = [],
        helpers = __dirname + '/helpers/nested';
        
    watchn.watch(helpers, function (curr, prev) {
      assert.notEqual(curr.mtime, prev.mtime, null, true);
      if (files.length > 0) {
        fs.writeFile(files.shift(), comment + new Date(), function (err) {
          if (err) {
            throw err;
          }
        });

      } else {
        assert.nextTest();
      }
    });
    files = watchn.globbed(helpers);
    fs.writeFile(files.shift(), comment + new Date(), function (err) {
      if (err) {
        throw err;
      }
    });
  };
        
  it.should_unwatch_directory = function () {
    var helpers = __dirname + '/helpers/nested',
        globlen = watchn.globbed(helpers).length;

    watchn.watch(helpers, function (curr, prev, file) {});
    assert.equal(watchn.watched.length, globlen, null, true);
    
    watchn.unwatch(helpers);
    assert.equal(watchn.watched.length, 0);
  };
  
  it.should_kill_all_watched_files = function () {
    var helpers = __dirname + '/helpers/nested',
        globlen = watchn.globbed(helpers).length;

    watchn.watch(helpers, function (curr, prev, file) {});
    assert.equal(watchn.watched.length, globlen, null, true);
    
    watchn.kill();
    assert.equal(watchn.watched.length, 0);
  };
  
  it.should_error_on_missing_env_for_action = function () {
    assert.throws(function () {
      watchn.action();
    });
  };
  
  it.should_error_on_missing_program_for_action = function () {
    assert.throws(function () {
      watchn.action({env: 'node'});
    });
  };
        
  it.should_run_node_program = function () {
    var env = 'node',
        prog = __dirname + '/helpers/noder.js',
        exit = function (code) {
          assert.equal(code, 0);
        };
    watchn.action({env: env, program: prog, exit: exit});
  };
  
  it.should_run_ruby_program = function () {
    var env = 'ruby',
        prog = __dirname + '/helpers/ruby.rb',
        exit = function (code) {
          assert.equal(code, 0);
        };
    watchn.action({env: env, program: prog, exit: exit});
  };
  
  it.should_watch_new_file_added = function () {
    var helpers = __dirname + '/helpers/nested',
        globlen = watchn.globbed(helpers).length,
        added = __dirname + '/helpers/nested/temp_helper.js',
        watchit = function () {
          watchn.watch(helpers, function (curr, prev, file) {});
        };
        
    watchn.watch(helpers, function (curr, prev, file) {});
    assert.equal(watchn.watched.length, globlen, null, true);
    
    fs.openSync(added, 'w+');
    watchn.reload(watchit);
    assert.equal(watchn.watched.length, globlen + 1, null, true);
    
    fs.unlinkSync(added);
    assert.nextTest();
  };
  
  it.should_watch_new_file_added_then_deleted = function () {
    var helpers = __dirname + '/helpers/nested',
        globlen = watchn.globbed(helpers).length,
        added = __dirname + '/helpers/nested/temp_helper.js',
        watchit = function () {
          watchn.watch(helpers, function (curr, prev, file) {});
        };

    watchn.watch(helpers, function (curr, prev, file) {});
    assert.equal(watchn.watched.length, globlen, null, true);
    
    fs.openSync(added, 'w+');
    watchn.reload(watchit);
    assert.equal(watchn.watched.length, globlen + 1, null, true);
    
    fs.unlinkSync(added);
    watchn.reload(watchit);
    assert.equal(watchn.watched.length, globlen);
  };
  
  it.should_watch_same_file_with_separate_actions = function () {
    var helper = __dirname + '/helpers/helper.js',
        env = 'node',
        prog = __dirname + '/helpers/noder.js',
        count = 0;
    
    watchn.watch(helper, function (curr, prev) {
      watchn.action({env: env, program: prog, exit: function (code) {
        count += 1;
        assert.equal(code, 0, null, true);
      }});  
    });
    
    watchn.watch(helper, function (curr, prev) {  
      setTimeout(function () {
        watchn.action({env: env, program: prog, exit: function (code) {
          count += 1;
          assert.equal(code, 0, null, true);
          assert.equal(count, 2);
        }});
      }, 100);
    });
    
    fs.writeFile(helper, comment + new Date(), function (err) {
      if (err) {
        throw err;
      }
    });
  };
  
// ----------------------------------------------------------------------------  
  assert.start(it, 'test.js');

}());
