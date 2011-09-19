
// Reporter for minifying JavaScript files with [Uglify](https://github.com/mishoo/UglifyJS)
// (c) 2011 Matthew Kitt

var Reporter = require('./reporter')
var inherit = require("util").inherits;

var UglifyReporter = module.exports = function UglifyReporter() {
  this.name = 'Uglify'
  this.passed_message = 'made it ugly'
  this.failed_message = 'failed'
}

inherit(UglifyReporter, Reporter)

UglifyReporter.prototype.passed = function(error, stdout, stderr) {
  var msg = (this.name + ' ' + this.passed_message).toLowerCase()
  return {name: this.name, msg: msg, gmsg: this.passed_message}
}

UglifyReporter.prototype.failed = function(error, stdout, stderr) {
  var gmsg = this.trim(stderr.split('\n')[1])
  return {name: this.name, msg: stderr, gmsg: 'Syntax Error ' + gmsg}
}

