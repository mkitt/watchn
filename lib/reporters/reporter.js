

var Reporter = module.exports = function Reporter() {
  this.name = 'Basic'
}

Reporter.prototype.report = function(error, stdout, stderr) {
  if (error !== null) {
    return {msg: error.msg, gmsg: 'Build Failed!'};
    // notify(error.message, {name: 'Docs', msg: 'Build Failed!'});
  } else {
    // notify('docs generated');
  }

  return {msg: stdout, gmsg:'complete'}
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

/*
  x fail if no task
  x fail if no options?
  - growl === growl default is true (silent and not installed will override)
  - send out the result to the reporter for proper parsing

  - How to pass message strings? (in object)
  - Growl only on success or failure (in object)
  - Possible return function?
  - Can we find a way not have to pass options?
  - Test this stuff!
*/

