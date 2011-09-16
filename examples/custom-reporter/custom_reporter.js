
var CustomReporter = module.exports = function CustomReporter() {
  this.name = 'Custom Reporter'
  this.passed_message = 'generated'
  this.failed_message = 'failed'
}

CustomReporter.prototype.report = function(error, stdout, stderr) {
  if (error !== null) {
    return this.failed(error, stdout, stderr)
  }
  return this.passed(error, stdout, stderr)
}

CustomReporter.prototype.passed = function(error, stdout, stderr) {
  var msg = (this.name + ' ' + this.passed_message).toLowerCase()
  return {name: this.name, msg: msg, gmsg: this.passed_message}
}

CustomReporter.prototype.failed = function(error, stdout, stderr) {
  return {name: this.name, msg: stderr, gmsg: this.failed_message}
}

