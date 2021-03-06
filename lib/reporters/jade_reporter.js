
// Reporter for compiling [Jade](http://jade-lang.com/) files
// (c) 2011 Matthew Kitt

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
  var msg = stderr.match(/^Error.*/gmi)
  return {name: this.name + ' Failed', msg: stderr, gmsg: msg}
}

