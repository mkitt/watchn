
var assert = require('assert')
var ExpressoReporter = require('reporters/expresso_reporter')
var reporter

function before() {
  reporter = new ExpressoReporter()
}

module.exports = {
  'test #constructor': function() {
    before()
    assert.eql(reporter.name, 'Expresso')
  },

  'test #inherited the trim function': function() {
    before()
    assert.isDefined(reporter.trim(''))
  },

  'test #passed': function() {
    before()
    var stderr = '\n\n   100% 69 tests \n'
    var report = reporter.passed(null, 'stdout', stderr)
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, '100% 69 tests')
    assert.eql(report.gmsg, '100% 69 tests passed')
  },

  'test #failed': function() {
    before()
    var stderr = '\n\n   Failures: 2 \n'
    var report = reporter.failed({msg: 'Failures: 2'}, 'stdout', stderr)
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, stderr)
    assert.eql(report.gmsg, 'Failures: 2')
  }

}

