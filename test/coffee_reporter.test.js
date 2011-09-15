
var assert = require('assert')
var CoffeeReporter = require('coffee_reporter')
var reporter

function before() {
  reporter = new CoffeeReporter()
}

module.exports = {
  'test #constructor': function() {
    before()
    assert.eql(reporter.name, 'CoffeeScript')
  },

  'test #inherited the trim function': function() {
    before()
    assert.isDefined(reporter.trim(''))
  },

  'test #passed': function() {
    before()
    var report = reporter.passed(null, 'stdout', 'stderr')
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, 'coffeescript generated')
    assert.eql(report.gmsg, reporter.passed_message)
  },

  'test #failed': function() {
    before()
    var stderr = 'first line\n second line'
    var report = reporter.failed({msg: 'failed'}, 'stdout', stderr)
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, stderr)
    assert.eql(report.gmsg, 'first line')
  }

}

