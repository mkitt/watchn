
var Reporter = require('./reporter')
var inherit = require("util").inherits;

var JadeReporter = module.exports = function JadeReporter() {
  this.name = 'Jade'
  this.passed_message = 'generated'
  this.failed_message = 'failed'
}

inherit(JadeReporter, Reporter)

JadeReporter.prototype.passed = function(error, stdout, stderr) {
  var msg = (this.name + ' ' + this.passed_message).toLowerCase()
  return {name: this.name, msg: msg, gmsg: this.passed_message}
}

JadeReporter.prototype.failed = function(error, stdout, stderr) {
  return {name: this.name, msg: stderr, gmsg: this.failed_message}
}

