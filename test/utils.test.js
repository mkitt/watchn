
var utils = require('../lib/utils')
var assert = require('assert')
var path = require('path')
var fixtures = path.normalize('./test/fixtures/')

module.exports = {

  'test #difference': function() {
    assert.eql(utils.difference([1,2,3,4], [1,2,3]), [4])
  },

  'test #uid': function() {
    var fixtureid = 'test_fixtures_'
    var fileid = '_test_watchn_test_js'
    assert.eql(utils.uid(fixtures), fixtureid)
  },

  'test #timestamp': function() {
    // before()
    var time = utils.timestamp()
    assert.match(time, /\d+\:\d+\:\d+/)
  }

}

