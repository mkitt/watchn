
var Reporter = require('./reporter')
var inherit = require("util").inherits;

var JasmineDomReporter = module.exports = function JasmineDomReporter() {
  this.name = 'Jasmine Dom'
  this.passed_message = this.name + ' Passed'
  this.failed_message = this.name + ' Failed!'
}

inherit(JasmineDomReporter, Reporter)

JasmineDomReporter.prototype.passed = function(error, stdout, stderr) {
  var passed = stdout.match(/(Passed)/gi)
  var trimmed = this.trimLastNewline(stdout)
  var name = passed ? this.passed_message : this.failed_message
  var msg = this.name + ': ' + trimmed
  var gmsg = passed ? trimmed : this.results(trimmed)
  return {name: name, msg: msg, gmsg: gmsg}
}

JasmineDomReporter.prototype.failed = function(error, stdout, stderr) {
  var msg = this.failed_message + ': ' + stdout
  var gmsg = this.results(stdout)
  return {name: this.failed_message, msg: stdout, gmsg: gmsg}
}

JasmineDomReporter.prototype.results = function(stdout) {
  var matches = stdout.match(/(-\s)/gi).length
  var msg = matches + ' spec' + ((matches === 1) ? '' : 's') + ' failed'
  return msg
}

