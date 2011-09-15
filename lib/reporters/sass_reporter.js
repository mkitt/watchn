
var Reporter = require('./reporter')
var inherit = require("util").inherits;

var SASSReporter = module.exports = function SASSReporter() {
  this.name = 'SASS'
  this.passed_message = 'generated'
  this.failed_message = 'failed'
}

inherit(SASSReporter, Reporter)

SASSReporter.prototype.passed = function(error, stdout, stderr) {
  var msg = (this.name + ' ' + this.passed_message).toLowerCase()
  return {name: this.name, msg: msg, gmsg: this.passed_message}
}

SASSReporter.prototype.failed = function(error, stdout, stderr) {
  var gmsg = this.trim(stderr.split('\n')[1])
  return {name: this.name, msg: stderr, gmsg: 'Syntax Error ' + gmsg}
}

