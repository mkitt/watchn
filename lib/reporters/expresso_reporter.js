
var Reporter = require('./reporter')
var inherit = require("util").inherits;

var ExpressoReporter = module.exports = function ExpressoReporter() {
  this.name = 'Expresso'
}

inherit(ExpressoReporter, Reporter);

ExpressoReporter.prototype.report = function(error, stdout, stderr) {
  var gmsg = this.trim(this.trimANSI(stderr))

  if (error !== null) {
    gmsg = gmsg.substr(gmsg.search(/(failures)/i))
    return {name: this.name, msg: stderr, gmsg: gmsg }
  } else {
    var msg = this.trim(this.trimNewlines(stderr))
    return {name: this.name, msg: msg, gmsg: gmsg + ' passed' }
  }

}

