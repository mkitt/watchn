
// Reporter for compiling [Stylus](http://learnboost.github.com/stylus/docs/js.html) files
// (c) 2011 Matthew Kitt

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
  var msg = stderr.match(/^Parse.*/gmi)
  return {name: this.name + ' Failed', msg: stderr, gmsg: msg}
}

