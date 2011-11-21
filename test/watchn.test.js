
var fs = require('fs')
var assert = require('assert')
var path = require('path')
var exec = require('child_process').exec
var utils = require('../lib/utils')
var Watchn = require('../lib/watchn')
var watchn
var fixtures = path.normalize('./test/fixtures/')


function before() {
  try {
    watchn.dispose()
  } catch (err) {}
  watchn = new Watchn(true, true)
}


module.exports = {

  /* Public API */

  'test #constructor': function() {
    before()
    assert.eql(watchn.watched.length, 0)
    assert.eql(watchn.rules.length, 0)
  },

  'test #constructor created a default reporter': function() {
    before()
    assert.ok(watchn.reporters.hasKey('reporter'))
  },

  'test #xwatch is a noop method': function() {
    before()
    watchn.xwatch('test', [fixtures, __filename], function(){})
    assert.eql(watchn.watched.length, 0)
    assert.eql(watchn.rules.length, 0)
  },

  'test #watch throws errors on missing args': function() {
    before()
    assert.throws(function () {
      watchn.watch()
    })
    assert.throws(function () {
      watchn.watch('test')
    })
    assert.throws(function () {
      watchn.watch('test', fixtures)
    })
  },

  'test #watch from a string location': function() {
    before()
    watchn.watch('test', __filename, function(){})
    assert.eql(watchn.watched.length, 1)
    assert.ok(watchn.watched.hasValue(__filename))
    assert.ok(watchn.watched.hasKey(utils.uid(__filename)))
  },

  'test #watch from an Array': function() {
    before()
    watchn.watch('test', [fixtures, __filename], function(){})
    assert.eql(watchn.watched.length, 2)
    assert.ok(watchn.watched.hasValue(__filename))
    assert.ok(watchn.watched.hasKey(utils.uid(__filename)))
    assert.ok(watchn.watched.hasValue(fixtures))
    assert.ok(watchn.watched.hasKey(utils.uid(fixtures)))
  },

  'test #execute throws on missing required arguments': function() {
    before()
    assert.throws(function () {
      watchn.execute()
    })
  },

  'test #execute defaults to the "reporter" as the reporter': function() {
    before()
    watchn.execute('make noop', {curr:0, prev:0})
    assert.ok(watchn.reporters.hasKey('reporter'))
  },

  'test #unwatch without args': function() {
    before()
    watchn.watch('test', [fixtures, __filename], function(){})
    watchn.unwatch()
    assert.eql(watchn.watched.length, 0)
    assert.eql(watchn.rules.length, 0)
  },

  'test #unwatch by rule': function() {
    before()
    watchn.watch('test', [fixtures, __filename], function(){})
    watchn.watch('demo', [fixtures, __filename], function(){})

    assert.eql(watchn.rules.length, 2)
    watchn.unwatch('test')
    assert.eql(watchn.rules.length, 1)
    assert.eql(watchn.rules.hasKey('demo'), true)
    assert.eql(watchn.rules.hasKey('test'), false)
  },

  'test #unwatch by location': function() {
    before()
    watchn.watch('test', [fixtures, __filename], function(){})
    watchn.watch('demo', [fixtures, __filename], function(){})
    watchn.unwatch(null, fixtures)

    assert.eql(watchn.rules.length, 2)
    assert.eql(watchn.rules.get('test').watched.length, 1)
    assert.eql(watchn.rules.get('demo').watched.length, 1)
    assert.eql(watchn.rules.get('test').watched.hasValue(fixtures), false)
    assert.eql(watchn.rules.get('demo').watched.hasValue(fixtures), false)
    assert.eql(watchn.rules.get('test').watched.hasValue(__filename), true)
    assert.eql(watchn.rules.get('demo').watched.hasValue(__filename), true)
    assert.eql(watchn.watched.length, 1)
  },

  'test #unwatch by rule and location': function() {
    before()
    watchn.watch('test', [fixtures, __filename], function(){})
    watchn.watch('demo', [fixtures, __filename], function(){})
    watchn.unwatch('test', fixtures)

    assert.eql(watchn.rules.get('test').watched.length, 1)
    assert.eql(watchn.rules.get('test').watched.hasValue(fixtures), false)
    assert.eql(watchn.rules.get('test').watched.hasValue(__filename), true)
    assert.eql(watchn.rules.get('demo').watched.hasValue(fixtures), true)
    assert.eql(watchn.rules.get('demo').watched.hasValue(__filename), true)
  },

  'test #changed': function() {
    before()
    watchn.addToRules('test', __filename, function(options) {
      assert.eql(__filename, options.item)
    })
    watchn.addToRules('demo', __filename, function(options) {
      assert.eql(__filename, options.item)
    })
    watchn.changed({curr: null, prev: null, item: __filename, stats: null})
  },

  'test #notify': function() {
    before()
    watchn.silent = false
    assert.doesNotThrow(function () {
      watchn.notify('')
    })
    watchn.silent = true
  },

  'test #inspect': function() {
    before()
    watchn.watch('test', [fixtures, __filename], function(){})
    assert.includes(watchn.inspect(), fixtures)
    assert.includes(watchn.inspect(), __filename)
  },

  'test #dispose': function() {
    before()
    assert.eql(watchn.watched.length, 0)
    watchn.dispose()
  },

  /* Internal */

  'test #addToWatched': function() {
    before()
    assert.eql(watchn.addToWatched(fixtures), false)
    assert.eql(watchn.addToWatched(fixtures), true)
    assert.eql(watchn.watched.length, 1)
    assert.ok(watchn.watched.hasValue(fixtures))
    assert.ok(watchn.watched.hasKey(utils.uid(fixtures)))
  },

  'test #addToRules': function() {
    before()
    assert.eql(watchn.addToRules('test', __filename, function(){}), true)
    assert.eql(watchn.addToRules('test', fixtures, function(){}), false)
    assert.eql(watchn.addToRules('log', fixtures, function(){}), true)
    assert.eql(watchn.rules.length, 2)
    assert.eql(watchn.rules.get('test').watched.length, 2)
    assert.eql(watchn.rules.get('log').watched.length, 1)
    assert.ok(watchn.rules.get('test').watched.hasKey(utils.uid(__filename)))
    assert.ok(watchn.rules.get('log').watched.hasKey(utils.uid(fixtures)))
  },

  'test #removeFromWatched single watchn': function() {
    before()
    assert.eql(watchn.addToWatched(fixtures), false)
    assert.eql(watchn.watched.length, 1)
    assert.eql(watchn.removeFromWatched(fixtures), false)
    assert.eql(watchn.watched.length, 0)
  },

  'test #removeFromWatched multiple watchns': function() {
    before()
    assert.eql(watchn.addToWatched(fixtures), false)
    watchn.addToRules('test', fixtures, function(){})
    watchn.addToRules('log', fixtures, function(){})
    assert.eql(watchn.watched.length, 1)
    assert.eql(watchn.rules.length, 2)

    watchn.removeRule('test')
    assert.eql(watchn.watched.length, 1)
    assert.eql(watchn.watched.hasKey(utils.uid(fixtures)), true)
    assert.eql(watchn.watched.hasValue(fixtures), true)
  },

  'test #unwatchAll': function() {
    before()
    assert.eql(watchn.addToWatched(fixtures), false)
    assert.eql(watchn.addToWatched(__filename), false)
    assert.eql(watchn.watched.length, 2)
    watchn.unwatchAll()
    assert.eql(watchn.watched.length, 0)
    assert.eql(watchn.rules.length, 0)
  },

  'test #removeRule': function() {
    before()
    watchn.addToRules('test', fixtures, function(){})
    watchn.addToRules('log', fixtures, function(){})

    assert.eql(watchn.rules.length, 2)
    assert.eql(watchn.removeRule('test').length, 1)
    assert.eql(watchn.rules.length, 1)
    assert.eql(watchn.rules.hasKey('log'), true)
    assert.eql(watchn.rules.hasKey('test'), false)
  },

  'test #removeLocationFromRule': function() {
    before()
    watchn.addToRules('test', __filename, function(){})
    watchn.addToRules('test', fixtures, function(){})
    assert.eql(watchn.addToWatched(__filename), false)
    assert.eql(watchn.addToWatched(fixtures), false)

    watchn.removeLocationFromRule('test', __filename)
    assert.eql(watchn.rules.get('test').watched.length, 1)
    assert.eql(watchn.watched.length, 1)
    assert.eql(watchn.rules.get('test').watched.hasValue(__filename), false)
  },

  'test #removeLocationsFromRule': function() {
    before()
    watchn.addToRules('test', __filename, function(){})
    watchn.addToRules('demo', __filename, function(){})
    watchn.addToRules('test', fixtures, function(){})

    assert.eql(watchn.removeLocationsFromRule('test', __filename).length, 1)
    assert.eql(watchn.rules.get('test').watched.length, 1)
    assert.eql(watchn.rules.get('test').watched.hasValue(__filename), false)
  },

  'test #removeLocation': function() {
    before()
    watchn.addToRules('test', fixtures, function(){})
    watchn.addToRules('test', __filename, function(){})
    watchn.addToRules('demo', __filename, function(){})

    assert.eql(watchn.removeLocation(__filename), 2)
    assert.eql(watchn.rules.length, 2)
    assert.eql(watchn.rules.get('test').watched.length, 1)
    assert.eql(watchn.rules.get('demo').watched.length, 0)
    assert.eql(watchn.rules.get('test').watched.hasValue(fixtures), true)
    assert.eql(watchn.rules.get('test').watched.hasValue(__filename), false)
    assert.eql(watchn.rules.get('demo').watched.hasValue(__filename), false)
  },

  'test #removeAllLocations': function() {
    before()
    watchn.addToRules('test', fixtures, function(){})
    watchn.addToRules('test', __filename, function(){})
    watchn.addToRules('demo', __filename, function(){})

    assert.eql(watchn.removeAllLocations(__filename).length, 1)
    assert.eql(watchn.rules.length, 2)
    assert.eql(watchn.rules.get('test').watched.length, 1)
    assert.eql(watchn.rules.get('demo').watched.length, 0)
    assert.eql(watchn.rules.get('test').watched.hasValue(fixtures), true)
    assert.eql(watchn.rules.get('test').watched.hasValue(__filename), false)
    assert.eql(watchn.rules.get('demo').watched.hasValue(__filename), false)
  },

  'test #modified': function() {
    var self = this
    var dir = 'templates/'
    var add = dir + 'newbie'
    before()

    watchn.addToRules('mod', dir, function(options) {
      assert.eql(dir, options.item)
    })

    fs.mkdirSync(add, '0777')
    watchn.changed({curr: null, prev: null, item: dir, stats: null})
    var yep = watchn.watched.values
    fs.rmdirSync(add)
    assert.includes(yep, add)
  },

  'test #getReporter returns me an instance of a reporter already created': function() {
    before()
    assert.eql(watchn.getReporter('reporter'), watchn.reporters.get('reporter'))
  },

  'test #getReporter returns me an instance of a reporter not already created': function() {
    before()
    var reporter = watchn.getReporter('expresso')
    assert.eql(watchn.getReporter('expresso'), watchn.reporters.get('expresso'))
  },

  'test #createReporter from one of the default reporters (in path)': function() {
    before()
    var reporter = watchn.createReporter('expresso')
    assert.ok(watchn.reporters.hasKey('expresso'))
    assert.eql(watchn.getReporter('expresso'), watchn.reporters.get('expresso'))
  },

  'test #createReporter testing the report function': function() {
    before()
    assert.throws(function () {
      watchn.createReporter('missing')
    })
  },

  'test #createReporter from a user defined reporter (outside path)': function() {
    before()
    var reporter = watchn.createReporter('custom')
    assert.ok(watchn.reporters.hasKey('custom'))
    assert.eql(watchn.getReporter('custom'), watchn.reporters.get('custom'))
  },

  'test #findReporterFile': function() {
    var file = watchn.findReporterFile(process.cwd(), 'custom_reporter')
    assert.isDefined(file)
  },


  'test #collect': function() {
    before()
    var collected = watchn.collect([fixtures], [])
    assert.eql(collected.length, 1)
  },

  'test #collect with sub directories': function() {
    before()
    var collected = watchn.collect([path.normalize('./test/')], [])
    assert.ok(collected.length > 1)
  }
}

