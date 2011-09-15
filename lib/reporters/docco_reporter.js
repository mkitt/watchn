
var Reporter = require('./reporter')
var inherit = require("util").inherits;

var DoccoReporter = module.exports = function DoccoReporter() {
  this.name = 'Docco'
  this.passed_message = 'generated'
  this.failed_message = 'failed'
}

inherit(DoccoReporter, Reporter)

DoccoReporter.prototype.passed = function(error, stdout, stderr) {
  var output = this.trimLastNewline(stdout)
  var files = output.split('\n').length
  var post = (files === 1) ? '' : 's'
  var gmsg = this.passed_message + ' ' + files + ' file' + post

  return {name: this.name, msg: output, gmsg: gmsg}
}

DoccoReporter.prototype.failed = function(error, stdout, stderr) {
  return {name: this.name, msg: stderr, gmsg: this.failed_message}
}

