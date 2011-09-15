
var assert = require('assert')
var JasmineReporter = require('jasmine_reporter')
var reporter

function before() {
  reporter = new JasmineReporter()
}

module.exports = {
  'test #constructor': function() {
    before()
    assert.eql(reporter.name, 'Jasmine')
  },

  'test #inherited the trim function': function() {
    before()
    assert.isDefined(reporter.trim(''))
  },

  'test #passed': function() {
    before()
    var stdout = 'Finished in 0.011 seconds\n1 test, 2 assertions, 1 failure'
    var report = reporter.passed(null, stdout, 'stderr')
    assert.eql(report.name, reporter.passed_message)
    assert.eql(report.msg, 'Jasmine Passed: 1 test, 2 assertions, 1 failure')
    assert.eql(report.gmsg, '1 test, 2 assertions, 1 failure')
  },

  'test #failed': function() {
    before()
    var stdout = 'Finished in 0.011 seconds\n1 test, 2 assertions, 1 failure'
    var report = reporter.failed({msg: 'failed'}, stdout, 'stderr')
    assert.eql(report.name, reporter.failed_message)
    assert.eql(report.msg, stdout)
    assert.eql(report.gmsg, '1 test, 2 assertions, 1 failure')
  },

  'test #results': function() {
    before()
    var stdout = 'Finished in 0.011 seconds\n1 test, 2 assertions, 1 failure'
    assert.eql(reporter.results(stdout), '1 test, 2 assertions, 1 failure')
  }

}

