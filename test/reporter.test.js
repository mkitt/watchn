
var assert = require('assert')
var Reporter = require('reporter')
var reporter

function before() {
  reporter = new Reporter()
}

module.exports = {

  'test #constructor': function() {
    before()
    assert.eql(reporter.name, 'Reporter')
    assert.eql(reporter.passed_message, 'passed')
    assert.eql(reporter.failed_message, 'failed')
  },

  'test #report with error': function() {
    before()
    var report = reporter.report({msg:'error'}, 'stdout', 'stderr')
    assert.eql(report.msg, 'error')
    assert.eql(report.gmsg, 'failed')
  },

  'test #report without error': function() {
    before()
    var report = reporter.report(null, 'stdout', 'stderr')
    assert.eql(report.msg, 'stdout')
    assert.eql(report.gmsg, 'passed')
  },

  'test #passed': function() {
    before()
    var message = reporter.passed(null, 'stdout', 'stderr')
    assert.eql(message.msg, 'stdout')
    assert.eql(message.gmsg, 'passed')
  },

  'test #failed': function() {
    before()
    var message = reporter.failed({msg:'error'}, 'stdout', 'stderr')
    assert.eql(message.msg, 'error')
    assert.eql(message.gmsg, 'failed')
  },

/* Helper Methods */

  'test #trim': function() {
    before()
    var pre = '   this is a string   '
    var post = 'this is a string'
    assert.eql(reporter.trim(pre), post)
  },

  'test #trimANSI': function() {
    before()
    var pre = '[30m100%[0m 20 tests passed'
    var post = '100% 20 tests passed'
    assert.eql(reporter.trimANSI(pre), post)
  },

  'test #trimNewlines': function() {
    before()
    var pre = 'yabba\ndabba'
    var post = 'yabba dabba'
    assert.eql(reporter.trimNewlines(pre), post)
  },

  'test #trimLastNewline': function() {
    before()
    var pre = 'yabba\ndabba\ndoo\n'
    var len = reporter.trimLastNewline(pre).split('\n').length
    assert.eql(len, 3)
  }

}

