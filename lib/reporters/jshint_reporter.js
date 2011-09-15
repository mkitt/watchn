
var Reporter = require('./reporter')
var inherit = require("util").inherits;

var JSHintReporter = module.exports = function JSHintReporter() {
  this.name = 'JSHint'
  this.passed_message = this.name + ' Passed'
  this.failed_message = this.name + ' Failed!'
}

inherit(JSHintReporter, Reporter)

JSHintReporter.prototype.passed = function(error, stdout, stderr) {
  var trimmed = this.trimLastNewline(stdout)
  var passed = stdout.match(/(Lint)/gi)
  var name = passed ? this.passed_message : this.failed_message
  var msg = this.name + ': ' + trimmed
  var gmsg = passed ? trimmed : this.results(trimmed)
  return {name: name, msg: msg, gmsg: gmsg}
}

JSHintReporter.prototype.failed = function(error, stdout, stderr) {
  return {name: this.name, msg: stderr, gmsg: this.failed_message}
}

JSHintReporter.prototype.results = function(stdout) {
  var pattern = /^\d+/gim
  var status = stdout.match(pattern)
  var errs = parseInt(status, 10)
  var msg = errs + ' error' + ((errs === 1) ? '' : 's')
  return msg
}

