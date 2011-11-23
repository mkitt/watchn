
var assert = require('assert')
var JadeReporter = require('../../lib/reporters/jade_reporter')
var reporter

function before() {
  reporter = new JadeReporter()
}

module.exports = {
  'test #constructor': function() {
    before()
    assert.eql(reporter.name, 'Jade')
  },

  'test #inherited the trim function': function() {
    before()
    assert.isDefined(reporter.trim(''))
  },

  'test #passed': function() {
    before()
    var report = reporter.passed(null, 'stdout', 'stderr')
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, 'jade generated')
    assert.eql(report.gmsg, reporter.passed_message)
  },

  'test #failed': function() {
    before()
    var stderr = 'Error'
    var report = reporter.failed({msg: 'failed'}, 'stdout', stderr)
    assert.eql(report.name, reporter.name + ' Failed')
    assert.eql(report.msg, stderr)
    assert.includes(report.gmsg, 'Error')
  }

}

