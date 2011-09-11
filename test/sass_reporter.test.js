
var assert = require('assert')
var SASSReporter = require('sass_reporter')
var reporter

function before() {
  reporter = new SASSReporter()
}

module.exports = {
  'test #constructor': function() {
    before()
    assert.eql(reporter.name, 'SASS')
  },

  'test #inherited the trim function': function() {
    before()
    assert.isDefined(reporter.trim(''))
  },

  'test #passed': function() {
    before()
    var report = reporter.passed(null, 'stdout', 'stderr')
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, 'sass generated')
    assert.eql(report.gmsg, reporter.passed_message)
  },

  'test #failed': function() {
    before()
    var stderr = 'first line\n on line 4 of somefile.sass'
    var report = reporter.failed({msg: 'failed'}, 'stdout', stderr)
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, stderr)
    assert.eql(report.gmsg, 'Syntax Error on line 4 of somefile.sass')
  }

}

