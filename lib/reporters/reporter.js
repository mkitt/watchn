
var Reporter = module.exports = function Reporter() {
  this.name = 'Reporter'
  this.passed_message = 'passed'
  this.failed_message = 'failed'
}

Reporter.prototype.report = function(error, stdout, stderr) {
  if (error !== null) {
    return this.failed(error, stdout, stderr)
  }
  return this.passed(error, stdout, stderr)
}

Reporter.prototype.passed = function(error, stdout, stderr) {
  return {msg: stdout, gmsg: this.passed_message}
}

Reporter.prototype.failed = function(error, stdout, stderr) {
  return {msg: error.msg, gmsg: this.failed_message}
}

// Clean up surrounding white space
Reporter.prototype.trim = function(str) {
  return str.replace(/^\s+|\s+$/g,'')
}

// Clean up any ansi characters
Reporter.prototype.trimANSI = function(str) {
  return str.replace(/\[\d+m/g, '')
}

// Clean up new lines
Reporter.prototype.trimNewlines = function(str) {
  return str.replace(/\n/g, ' ')
}

