
var assert = require('assert')
var DoccoReporter = require('reporters/docco_reporter')
var reporter

function before() {
  reporter = new DoccoReporter()
}

module.exports = {
  'test #constructor': function() {
    before()
    assert.eql(reporter.name, 'Docco')
  },

  'test #inherited the trim function': function() {
    before()
    assert.isDefined(reporter.trim(''))
  },

  'test #passed': function() {
    before()
    var stdout = 'docco: lib/reporter.js -> docs/reporter.html\ndocco: lib/watchn.js -> docs/watchn.html\n\n'
    var report = reporter.passed(null, stdout, 'stderr')
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, 'docco: lib/reporter.js -> docs/reporter.html\ndocco: lib/watchn.js -> docs/watchn.html')
    assert.eql(report.gmsg, reporter.passed_message + ' 2 files')
  },

  'test #failed': function() {
    before()
    var stderr = 'failed'
    var report = reporter.failed({msg: 'failed'}, 'stdout', stderr)
    assert.eql(report.name, reporter.name)
    assert.eql(report.msg, stderr)
    assert.eql(report.gmsg, reporter.failed_message)
  }

}

