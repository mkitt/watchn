
var assert = require('assert')
var VowsReporter = require('../../lib/reporters/vows_reporter')
var reporter

function before() {
  reporter = new VowsReporter()
}

module.exports = {
  'test #constructor': function() {
    before()
    assert.eql(reporter.name, 'Vows')
  },

  'test #inherited the trim function': function() {
    before()
    assert.isDefined(reporter.trim(''))
  },

  'test #passed': function() {
    before()
    var stdout = '....\n✓ OK » 4 honored (0.002s)'
    var report = reporter.passed(null, stdout, 'stderr')
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, 'Vows: ✓ OK » 4 honored (0.002s)')
    assert.eql(report.gmsg, '✓ OK » 4 honored (0.002s)')
  },

  'test #failed': function() {
    before()
    var stdout = 'first line\n ✗ Broken » 3 honored ∙ 1 broken (0.005s)\n'
    var report = reporter.failed({msg: 'failed'}, stdout, 'stderr')
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, 'Vows:  ✗ Broken » 3 honored ∙ 1 broken (0.005s)')
    assert.eql(report.gmsg, ' ✗ Broken » 3 honored ∙ 1 broken (0.005s)')
  }

}

