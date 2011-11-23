
var assert = require('assert')
var JasmineDomReporter = require('../../lib/reporters/jasmine_dom_reporter')
var reporter

function before() {
  reporter = new JasmineDomReporter()
}

module.exports = {
  'test #constructor': function() {
    before()
    assert.eql(reporter.name, 'Jasmine Dom')
  },

  'test #inherited the trim function': function() {
    before()
    assert.isDefined(reporter.trim(''))
  },

  'test #passed with a failure': function() {
    before()
    var stdout = 'Failed:\n\t - In index.html >> #namespace >> should just fail :: Expected false to equal true.'
    var report = reporter.passed(null, stdout, 'stderr')
    assert.eql(report.name, reporter.failed_message)
    assert.eql(report.msg, reporter.name + ': ' + stdout)
    assert.eql(report.gmsg, '1 spec failed')
  },

  'test #passed for realz': function() {
    before()
    var stdout = 'Passed'
    var report = reporter.passed(null, stdout, 'stderr')
    assert.eql(report.name, reporter.passed_message)
    assert.eql(report.msg, reporter.name + ': ' + stdout)
    assert.eql(report.gmsg, 'Passed')
  },

  'test #failed': function() {
    before()
    var stdout = 'Jasmine Dom: Failed:\n\t - In index.html >> #namespace >> should just fail :: Expected false to equal true.'
    var report = reporter.failed({msg: 'failed'}, stdout, 'stderr')
    assert.eql(report.name, reporter.failed_message)
    assert.eql(report.msg, stdout)
    assert.eql(report.gmsg, '1 spec failed')
  },

  'test #results': function() {
    before()
    var stdout = 'Jasmine Dom: Failed:\n\t - In index.html >> #namespace >> should just fail :: Expected false to equal true.'
    assert.eql(reporter.results(stdout), '1 spec failed')
  }

}

