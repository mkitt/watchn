
// Reporter for running [Expresso](http://visionmedia.github.com/expresso/) tests
// (c) 2011 Matthew Kitt

var Reporter = require('./reporter')
var inherit = require("util").inherits;

var ExpressoReporter = module.exports = function ExpressoReporter() {
  this.name = 'Expresso'
}

inherit(ExpressoReporter, Reporter)

ExpressoReporter.prototype.passed = function(error, stdout, stderr) {
  var gmsg = this.trim(this.trimANSI(stderr))
  var msg = this.trim(this.trimNewlines(stderr))
  return {name: this.name, msg: msg, gmsg: gmsg + ' passed'}
}

ExpressoReporter.prototype.failed = function(error, stdout, stderr) {
  var gmsg = this.trim(this.trimANSI(stderr))
  gmsg = gmsg.substr(gmsg.search(/(failures)/i))
  return {name: this.name, msg: stderr, gmsg: gmsg}
}

