
var assert = require('assert')
var HamlReporter = require('reporters/haml_reporter')
var reporter

function before() {
  reporter = new HamlReporter()
}

module.exports = {
  'test #constructor': function() {
    before()
    assert.eql(reporter.name, 'Haml')
  },

  'test #inherited the trim function': function() {
    before()
    assert.isDefined(reporter.trim(''))
  },

  'test #passed': function() {
    before()
    var report = reporter.passed(null, 'stdout', 'stderr')
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, 'haml generated')
    assert.eql(report.gmsg, reporter.passed_message)
  },

  'test #failed': function() {
    before()
    var stderr = 'Syntax error on line 8: Illegal nesting:...'
    var report = reporter.failed({msg: 'failed'}, 'stdout', stderr)
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, stderr)
    assert.eql(report.gmsg, 'Syntax error on line 8: Illegal nesting:...')
  }

}

