
var assert = require('assert')
var StylusReporter = require('../../lib/reporters/stylus_reporter')
var reporter

function before() {
  reporter = new StylusReporter()
}

module.exports = {
  'test #constructor': function() {
    before()
    assert.eql(reporter.name, 'Stylus')
  },

  'test #inherited the trim function': function() {
    before()
    assert.isDefined(reporter.trim(''))
  },

  'test #passed': function() {
    before()
    var report = reporter.passed(null, 'stdout', 'stderr')
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, 'stylus generated')
    assert.eql(report.gmsg, reporter.passed_message)
  },

  'test #failed': function() {
    before()
    var stderr = 'Parse'
    var report = reporter.failed({msg: 'failed'}, 'stdout', stderr)
    assert.eql(report.name, reporter.name + ' Failed')
    assert.eql(report.msg, stderr)
    assert.includes(report.gmsg, 'Parse')
  }

}

