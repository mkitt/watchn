
var fs = require('fs');
var assert = require('assert');
var path = require('path');
var exec = require('child_process').exec;
var Watchn = require('watchn');
var watcher;
var fixtures = path.normalize('./test/fixtures/');


function before() {
  try {
    watcher.dispose();
  } catch (err) {}
  watcher = new Watchn(true);
}


module.exports = {

  /* Public API */

  'test #constructor': function() {
    before();
    assert.eql(watcher.watched.length, 0);
    assert.eql(watcher.rules.length, 0);
  },

  'test #xwatch is a noop method': function() {
    before();
    watcher.xwatch('test', [fixtures, __filename], function(){});
    assert.eql(watcher.watched.length, 0);
    assert.eql(watcher.rules.length, 0);
  },

  'test #watch throws errors on missing args': function() {
    before();
    assert.throws(function () {
      watcher.watch();
    });
    assert.throws(function () {
      watcher.watch('test');
    });
    assert.throws(function () {
      watcher.watch('test', fixtures);
    });
  },

  'test #watch from a string location': function() {
    before();
    watcher.watch('test', __filename, function(){});
    assert.eql(watcher.watched.length, 1);
    assert.ok(watcher.watched.hasValue(__filename));
    assert.ok(watcher.watched.hasKey(watcher.uid(__filename)));
  },

  'test #watch from an Array': function() {
    before();
    watcher.watch('test', [fixtures, __filename], function(){});
    assert.eql(watcher.watched.length, 2);
    assert.ok(watcher.watched.hasValue(__filename));
    assert.ok(watcher.watched.hasKey(watcher.uid(__filename)));
    assert.ok(watcher.watched.hasValue(fixtures));
    assert.ok(watcher.watched.hasKey(watcher.uid(fixtures)));
  },

  'test #unwatch without args': function() {
    before();
    watcher.watch('test', [fixtures, __filename], function(){});
    watcher.unwatch();
    assert.eql(watcher.watched.length, 0);
    assert.eql(watcher.rules.length, 0);
  },

  'test #unwatch by rule': function() {
    before();
    watcher.watch('test', [fixtures, __filename], function(){});
    watcher.watch('demo', [fixtures, __filename], function(){});

    assert.eql(watcher.rules.length, 2);
    watcher.unwatch('test');
    assert.eql(watcher.rules.length, 1);
    assert.eql(watcher.rules.hasKey('demo'), true);
    assert.eql(watcher.rules.hasKey('test'), false);
  },

  'test #unwatch by location': function() {
    before();
    watcher.watch('test', [fixtures, __filename], function(){});
    watcher.watch('demo', [fixtures, __filename], function(){});
    watcher.unwatch(null, fixtures);

    assert.eql(watcher.rules.length, 2);
    assert.eql(watcher.rules.get('test').watched.length, 1);
    assert.eql(watcher.rules.get('demo').watched.length, 1);
    assert.eql(watcher.rules.get('test').watched.hasValue(fixtures), false);
    assert.eql(watcher.rules.get('demo').watched.hasValue(fixtures), false);
    assert.eql(watcher.rules.get('test').watched.hasValue(__filename), true);
    assert.eql(watcher.rules.get('demo').watched.hasValue(__filename), true);
    assert.eql(watcher.watched.length, 1);
  },

  'test #unwatch by rule and location': function() {
    before();
    watcher.watch('test', [fixtures, __filename], function(){});
    watcher.watch('demo', [fixtures, __filename], function(){});
    watcher.unwatch('test', fixtures);

    assert.eql(watcher.rules.get('test').watched.length, 1);
    assert.eql(watcher.rules.get('test').watched.hasValue(fixtures), false);
    assert.eql(watcher.rules.get('test').watched.hasValue(__filename), true);
    assert.eql(watcher.rules.get('demo').watched.hasValue(fixtures), true);
    assert.eql(watcher.rules.get('demo').watched.hasValue(__filename), true);
  },

  'test #changed': function() {
    before();
    watcher.addToRules('test', __filename, function(options) {
      assert.eql(__filename, options.item);
    });
    watcher.addToRules('demo', __filename, function(options) {
      assert.eql(__filename, options.item);
    });
    watcher.changed({curr: null, prev: null, item: __filename, stats: null});
  },

  // slightly lame..
  'test #notify': function() {
    before();
    watcher.silent = false;
    assert.doesNotThrow(function () {
      watcher.notify('');
    });
    watcher.silent = true;
  },

  'test #inspect': function() {
    before();
    watcher.watch('test', [fixtures, __filename], function(){});
    assert.includes(watcher.inspect(), fixtures);
    assert.includes(watcher.inspect(), __filename);
  },

  'test #dispose': function() {
    before();
    assert.eql(watcher.watched.length, 0);
    watcher.dispose();
  },

  /* Internal */

  'test #addToWatched': function() {
    before();
    assert.eql(watcher.addToWatched(fixtures), false);
    assert.eql(watcher.addToWatched(fixtures), true);
    assert.eql(watcher.watched.length, 1);
    assert.ok(watcher.watched.hasValue(fixtures));
    assert.ok(watcher.watched.hasKey(watcher.uid(fixtures)));
  },

  'test #addToRules': function() {
    before();
    assert.eql(watcher.addToRules('test', __filename, function(){}), true);
    assert.eql(watcher.addToRules('test', fixtures, function(){}), false);
    assert.eql(watcher.addToRules('log', fixtures, function(){}), true);
    assert.eql(watcher.rules.length, 2);
    assert.eql(watcher.rules.get('test').watched.length, 2);
    assert.eql(watcher.rules.get('log').watched.length, 1);
    assert.ok(watcher.rules.get('test').watched.hasKey(watcher.uid(__filename)));
    assert.ok(watcher.rules.get('log').watched.hasKey(watcher.uid(fixtures)));
  },

  'test #removeFromWatched single watcher': function() {
    before();
    assert.eql(watcher.addToWatched(fixtures), false);
    assert.eql(watcher.watched.length, 1);
    assert.eql(watcher.removeFromWatched(fixtures), false);
    assert.eql(watcher.watched.length, 0);
  },

  'test #removeFromWatched multiple watchers': function() {
    before();
    assert.eql(watcher.addToWatched(fixtures), false);
    watcher.addToRules('test', fixtures, function(){});
    watcher.addToRules('log', fixtures, function(){});
    assert.eql(watcher.watched.length, 1);
    assert.eql(watcher.rules.length, 2);

    watcher.removeRule('test');
    assert.eql(watcher.watched.length, 1);
    assert.eql(watcher.watched.hasKey(watcher.uid(fixtures)), true);
    assert.eql(watcher.watched.hasValue(fixtures), true);
  },

  'test #unwatchAll': function() {
    before();
    assert.eql(watcher.addToWatched(fixtures), false);
    assert.eql(watcher.addToWatched(__filename), false);
    assert.eql(watcher.watched.length, 2);
    watcher.unwatchAll();
    assert.eql(watcher.watched.length, 0);
    assert.eql(watcher.rules.length, 0);
  },

  'test #removeRule': function() {
    before();
    watcher.addToRules('test', fixtures, function(){});
    watcher.addToRules('log', fixtures, function(){});

    assert.eql(watcher.rules.length, 2);
    assert.eql(watcher.removeRule('test').length, 1);
    assert.eql(watcher.rules.length, 1);
    assert.eql(watcher.rules.hasKey('log'), true);
    assert.eql(watcher.rules.hasKey('test'), false);
  },

  'test #removeLocationFromRule': function() {
    before();
    watcher.addToRules('test', __filename, function(){});
    watcher.addToRules('test', fixtures, function(){});
    assert.eql(watcher.addToWatched(__filename), false);
    assert.eql(watcher.addToWatched(fixtures), false);

    watcher.removeLocationFromRule('test', __filename);
    assert.eql(watcher.rules.get('test').watched.length, 1);
    assert.eql(watcher.watched.length, 1);
    assert.eql(watcher.rules.get('test').watched.hasValue(__filename), false);
  },

  'test #removeLocationsFromRule': function() {
    before();
    watcher.addToRules('test', __filename, function(){});
    watcher.addToRules('demo', __filename, function(){});
    watcher.addToRules('test', fixtures, function(){});

    assert.eql(watcher.removeLocationsFromRule('test', __filename).length, 1);
    assert.eql(watcher.rules.get('test').watched.length, 1);
    assert.eql(watcher.rules.get('test').watched.hasValue(__filename), false);
  },

  'test #removeLocation': function() {
    before();
    watcher.addToRules('test', fixtures, function(){});
    watcher.addToRules('test', __filename, function(){});
    watcher.addToRules('demo', __filename, function(){});

    assert.eql(watcher.removeLocation(__filename), 2);
    assert.eql(watcher.rules.length, 2);
    assert.eql(watcher.rules.get('test').watched.length, 1);
    assert.eql(watcher.rules.get('demo').watched.length, 0);
    assert.eql(watcher.rules.get('test').watched.hasValue(fixtures), true);
    assert.eql(watcher.rules.get('test').watched.hasValue(__filename), false);
    assert.eql(watcher.rules.get('demo').watched.hasValue(__filename), false);
  },

  'test #removeAllLocations': function() {
    before();
    watcher.addToRules('test', fixtures, function(){});
    watcher.addToRules('test', __filename, function(){});
    watcher.addToRules('demo', __filename, function(){});

    assert.eql(watcher.removeAllLocations(__filename).length, 1);
    assert.eql(watcher.rules.length, 2);
    assert.eql(watcher.rules.get('test').watched.length, 1);
    assert.eql(watcher.rules.get('demo').watched.length, 0);
    assert.eql(watcher.rules.get('test').watched.hasValue(fixtures), true);
    assert.eql(watcher.rules.get('test').watched.hasValue(__filename), false);
    assert.eql(watcher.rules.get('demo').watched.hasValue(__filename), false);
  },

  'test #modified': function() {
    var self = this;
    var dir = 'templates/';
    var add = dir + 'newbie';
    before();

    watcher.addToRules('mod', dir, function(options) {
      assert.eql(dir, options.item);
    });

    fs.mkdirSync(add, '0777');
    watcher.changed({curr: null, prev: null, item: dir, stats: null});
    var yep = watcher.watched.values;
    fs.rmdirSync(add);
    assert.includes(yep, add);
  },

  'test #difference': function() {
    before();
    assert.eql(watcher.difference([1,2,3,4], [1,2,3]), [4]);
  },

  'test #collect': function() {
    before();
    var collected = watcher.collect([fixtures], []);
    assert.eql(collected.length, 1);
  },

  'test #collect with sub directories': function() {
    before();
    var collected = watcher.collect([path.normalize('./test/')], []);
    assert.eql(collected.length, 2);
  },

  'test #uid': function() {
    before();
    var fixtureid = 'test_fixtures_';
    var fileid = '_test_watchn_test_js';
    assert.eql(watcher.uid(fixtures), fixtureid);
    assert.includes(watcher.uid(__filename), fileid);
  },

/* Helper Methods */

  'test #trim': function() {
    before();
    var pre = '   this is a string   ';
    var post = 'this is a string';
    assert.eql(watcher.trim(pre), post);
  },

  'test #trimANSI': function() {
    before();
    var pre = '[30m100%[0m 20 tests passed';
    var post = '100% 20 tests passed';
    assert.eql(watcher.trimANSI(pre), post);
  },

  'test #trimNewlines': function() {
    before();
    var pre = 'yabba\ndabba';
    var post = 'yabba dabba';
    assert.eql(watcher.trimNewlines(pre), post);
  }

};

