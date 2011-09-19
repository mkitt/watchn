
// Base reporter for all Reporters. Handles generic tasks as well as adding a few string trimming functions
// (c) 2011 Matthew Kitt

// Set the name, plus passing and failing messages
var Reporter = module.exports = function Reporter() {
  this.name = 'Reporter'
  this.passed_message = 'passed'
  this.failed_message = 'failed'
}

// Parse out either a passing or failing messages based on the status of the output
Reporter.prototype.report = function(error, stdout, stderr) {
  if (error !== null) {
    return this.failed(error, stdout, stderr)
  }
  return this.passed(error, stdout, stderr)
}

// Parse and return a passing message
Reporter.prototype.passed = function(error, stdout, stderr) {
  return {msg: stdout, gmsg: this.passed_message}
}

// Parse and return a failing message
Reporter.prototype.failed = function(error, stdout, stderr) {
  return {msg: error.msg, gmsg: this.failed_message}
}

/* Helpers */

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

// Clean up the last line break in a string
Reporter.prototype.trimLastNewline = function(str) {
  return str.replace(/\n+$/g, '')
}

