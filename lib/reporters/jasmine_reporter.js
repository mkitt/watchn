
// Reporter for running [Jasmine](https://github.com/mhevery/jasmine-node/) specs
// (c) 2011 Matthew Kitt

var Reporter = require('./reporter')
var inherit = require("util").inherits;

var JasmineReporter = module.exports = function JasmineReporter() {
  this.name = 'Jasmine'
  this.passed_message = this.name + ' Passed'
  this.failed_message = this.name + ' Failed!'
}

inherit(JasmineReporter, Reporter)

JasmineReporter.prototype.passed = function(error, stdout, stderr) {
  var gmsg = this.results(this.trimANSI(stdout))
  var msg = this.passed_message + ': ' + gmsg
  return {name: this.passed_message, msg: msg, gmsg: gmsg}
}

JasmineReporter.prototype.failed = function(error, stdout, stderr) {
  var gmsg = this.results(this.trimANSI(stdout))
  var msg = this.trimLastNewline(stdout)
  return {name: this.failed_message, msg: msg, gmsg: gmsg}
}

JasmineReporter.prototype.results = function(stdout) {
  var pattern = /\d+/gim
  var status = stdout.match(pattern)
  var len = status.length
  var tests = parseInt(status[len - 3], 10)
  var asserts = parseInt(status[len - 2], 10)
  var failures = parseInt(status[len - 1], 10)
  var msg = ''
  msg += tests + ' test' +  ((tests === 1) ? ', ' : 's, ');
  msg += asserts + ' assertion' +  ((asserts === 1) ? ', ' : 's, ');
  msg += failures + ' failure' +  ((failures === 1) ? '' : 's');
  return msg
}

