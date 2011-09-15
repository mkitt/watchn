
var Reporter = require('./reporter')
var inherit = require("util").inherits;

var CoffeeReporter = module.exports = function CoffeeReporter() {
  this.name = 'CoffeeScript'
  this.passed_message = 'generated'
  this.failed_message = 'failed'
}

inherit(CoffeeReporter, Reporter)

CoffeeReporter.prototype.passed = function(error, stdout, stderr) {
  var msg = (this.name + ' ' + this.passed_message).toLowerCase()
  return {name: this.name, msg: msg, gmsg: this.passed_message}
}

CoffeeReporter.prototype.failed = function(error, stdout, stderr) {
  var gmsg = this.trim(stderr.split('\n')[0])
  return {name: this.name, msg: stderr, gmsg: gmsg}
}

