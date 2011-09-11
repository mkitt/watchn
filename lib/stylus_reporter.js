
var Reporter = require('./reporter')
var inherit = require("util").inherits;

var StylusReporter = module.exports = function StylusReporter() {
  this.name = 'Stylus'
  this.passed_message = 'generated'
  this.failed_message = 'failed'
}

inherit(StylusReporter, Reporter)

StylusReporter.prototype.passed = function(error, stdout, stderr) {
  var msg = (this.name + ' ' + this.passed_message).toLowerCase()
  return {name: this.name, msg: msg, gmsg: this.passed_message}
}

StylusReporter.prototype.failed = function(error, stdout, stderr) {
  return {name: this.name, msg: stderr, gmsg: this.failed_message}
}

