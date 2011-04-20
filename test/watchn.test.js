
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
  watcher.testenv = true;
}


module.exports = {
  'test .version': function() {
    before();
    assert.match(watcher.version, /^\d+\.\d+\.\d+$/);
  },

  'test #constructor': function() {
    before();
    assert.eql(watcher.watched.length, 0);
    assert.eql(watcher.started, false);
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
    assert.includes(watcher.watched, __filename);
  },

  'test #watch from an Array': function() {
    before();
    watcher.watch('test', [fixtures, __filename], function(){});
    assert.eql(watcher.watched.length, 2);
    assert.includes(watcher.watched, __filename);
    assert.includes(watcher.watched, fixtures);
  },

  'test #unwatch without args': function() {
    before();
    watcher.watch('test', [fixtures, __filename], function(){});
    watcher.unwatch();
    assert.eql(watcher.watched.length, 0);
  },

  'test #unwatch by rule': function() {
    before();
    watcher.watch('test', [fixtures, __filename], function(){});
    watcher.watch('demo', [fixtures, __filename], function(){});
    assert.eql(watcher.rules.length, 2);
    assert.eql(watcher.watched.length, 2);
    watcher.unwatch('test');
    assert.eql(watcher.rules.length, 1);
  },

  'test #unwatch by location': function() {
    before();
    watcher.watch('test', [fixtures, __filename], function(){});
    watcher.unwatch(null, fixtures);
    assert.eql(watcher.watched.length, 1);
    assert.eql(watcher.rules[0].watched.length, 1);
  },

  'test #unwatch by rule and location': function() {
    before();
    watcher.watch('test', [fixtures, __filename], function(){});
    watcher.watch('demo', [fixtures, __filename], function(){});
    watcher.unwatch('test', fixtures);
    assert.eql(watcher.watched.length, 2);
    assert.eql(watcher.rules.length, 2);
    assert.eql(watcher.rules[0].watched.length, 1);
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

  /* Internal */

  'test #addToWatched': function() {
    before();
    assert.eql(watcher.addToWatched(fixtures), false);
    assert.eql(watcher.addToWatched(fixtures), true);
    assert.eql(watcher.watched.length, 1);
  },

  'test #removeFromWatched': function() {
    before();
    assert.eql(watcher.addToWatched(fixtures), false);
    assert.eql(watcher.watched.length, 1);
    watcher.removeFromWatched(fixtures);
    assert.eql(watcher.watched.length, 0);
  },

  'test #unwatchAll': function() {
    before();
    assert.eql(watcher.addToWatched(fixtures), false);
    assert.eql(watcher.addToWatched(__filename), false);
    assert.eql(watcher.watched.length, 2);
    watcher.unwatchAll();
    assert.eql(watcher.watched.length, 0);
  },

  'test #addToRules': function() {
    before();
    watcher.addToRules('test', __filename, function(){});
    watcher.addToRules('test', fixtures, function(){});
    assert.eql(watcher.rules.length, 1);
    assert.eql(watcher.rules[0].watched.length, 2);
  },

  'test #removeRule': function() {
    before();
    watcher.addToRules('test', __filename, function(){});
    watcher.addToRules('test', fixtures, function(){});
    watcher.removeRule('test');
    assert.eql(watcher.rules.length, 0);
  },

  'test #removeLocations': function() {
    before();
    watcher.addToRules('test', __filename, function(){});
    watcher.addToRules('demo', __filename, function(){});
    watcher.removeLocations(__filename);
    assert.eql(watcher.rules.length, 2);
    assert.eql(watcher.rules[0].watched.length, 0);
  },

  'test #removeLocationFromRule': function() {
    before();
    watcher.addToRules('test', __filename, function(){});
    watcher.addToRules('test', fixtures, function(){});
    watcher.removeLocationFromRule('test', __filename);
    assert.eql(watcher.rules[0].watched.length, 1);
  },

  'test #removeLocationsFromRule': function() {
    before();
    watcher.addToRules('test', __filename, function(){});
    watcher.addToRules('demo', __filename, function(){});
    watcher.addToRules('test', fixtures, function(){});
    watcher.removeLocationsFromRule('test', __filename);
    assert.eql(watcher.rules[0].watched.length, 1);
  },

  'test #getRuleDefinition': function() {
    before();
    watcher.addToRules('test', __filename, function(){});
    watcher.addToRules('test', fixtures, function(){});
    var definition = watcher.getRuleDefinition('test');
    assert.eql(definition.watched.length, 2);
  },

  'test #numberOfListeners': function() {
    before();
    watcher.addToRules('test', __filename, function(){});
    watcher.addToRules('demo', __filename, function(){});
    assert.eql(watcher.numberOfListeners(__filename), 2);
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
  },

  'test #dispose': function() {
    before();
    assert.eql(watcher.watched.length, 0);
    watcher.testenv = false;
    watcher.dispose();
  }
};

