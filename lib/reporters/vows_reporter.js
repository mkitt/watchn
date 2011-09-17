
var Reporter = require('./reporter')
var inherit = require("util").inherits;

var VowsReporter = module.exports = function VowsReporter() {
  this.name = 'Vows'
  this.passed_message = 'generated'
  this.failed_message = 'failed'
}

inherit(VowsReporter, Reporter)

VowsReporter.prototype.passed = function(error, stdout, stderr) {
  var status = stdout.split('\n')[1]
  var msg = this.name + ': ' + status
  var gmsg = this.trimANSI(status)
  return {name: this.name, msg: msg, gmsg: gmsg}
}

VowsReporter.prototype.failed = function(error, stdout, stderr) {
  var trimmed = stdout.split('\n')
  var status = trimmed[trimmed.length - 2]
  var msg = this.name + ': ' + status
  var gmsg = this.trimANSI(status)
  return {name: this.name, msg: msg, gmsg: gmsg}
}

