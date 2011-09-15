
var assert = require('assert')
var JSHintReporter = require('reporters/jshint_reporter')
var reporter

function before() {
  reporter = new JSHintReporter()
}

module.exports = {
  'test #constructor': function() {
    before()
    assert.eql(reporter.name, 'JSHint')
  },

  'test #inherited the trim function': function() {
    before()
    assert.isDefined(reporter.trim(''))
  },

  'test #passed with a failure': function() {
    before()
    var stdout = 'examples/javascripts/src/file1.js: line 11, col 15, "arg" is not defined.\n6 errors'
    var report = reporter.passed(null, stdout, 'stderr')
    assert.eql(report.name, reporter.failed_message)
    assert.eql(report.msg, reporter.name + ': ' + stdout)
    assert.eql(report.gmsg, '6 errors')
  },

  'test #passed for realz': function() {
    before()
    var stdout = 'Lint Free!'
    var report = reporter.passed(null, stdout, 'stderr')
    assert.eql(report.name, reporter.passed_message)
    assert.eql(report.msg, reporter.name + ': ' + stdout)
    assert.eql(report.gmsg, 'Lint Free!')
  },

  'test #failed': function() {
    before()
    var stdout = 'examples/javascripts/src/file1.js: line 11, col 15, "arg" is not defined.\n6 errors'
    var report = reporter.failed({msg: 'failed'}, stdout, stdout)
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, stdout)
    assert.eql(report.gmsg, reporter.failed_message)
  },

  'test #results': function() {
    before()
    var stdout = 'examples/javascripts/src/file1.js: line 11, col 15, "arg" is not defined.\n6 errors'
    assert.eql(reporter.results(stdout), '6 errors')
  }

}

