
(function () {
  require.paths.push('./lib');
  var watchn = require('watchn'),
      fs = require('fs'),
      sys = require('sys'),
      logstr = '';

// -----------------------------------------------------------------------------
  
  function reload() {
    watchn.reload();
  }
  
  function growl(code, msg) {
    // TODO: turn this to a growl message
    sys.puts('\n------\nGrowl with code: ' + code + '\n' + msg + '------');
  }
  
  function record() {
    var logfile = './examples/log/log.txt',
        str = new Date() + '\n' + logstr;
    fs.writeFileSync(logfile, fs.readFileSync(logfile) + str);
  }
  
// -----------------------------------------------------------------------------

  function onTestProgress(data) {
    sys.print(data);
    logstr = data;
  }
  
  function onTestComplete(code, params) {
    growl(1, logstr);
    reload();
    record();
  }
  
  function runTestSuite(code, params) {
    var env = 'node',
        stdout = onTestProgress,
        exit = onTestComplete,
        runner = './examples/test/runner.js';
        
    if (code === 0) {
      watchn.action({env: env, program: runner, stdout: stdout, exit: exit});
    } else {
      growl(code, 'Test Failed ');
    }
  }
  
  function runTest(curr, prev, file, stats) {
    var env = 'node',
        stdout = onTestProgress,
        exit = runTestSuite;
    if (curr.mtime > prev.mtime) {
      watchn.action({env: env, program: file, stdout: stdout, exit: exit});
    }
  }

// -----------------------------------------------------------------------------
  
  function watch() {
    var testdir = './examples/test/',
        logfile = './examples/log/log.txt';
    
    watchn.initialize(watch);
    
    // run the test on the current spec file that's changed
    watchn.watch(testdir, function (curr, prev, file, stats) {
      runTest(curr, prev, file, stats);
    });
    
    // if the log file gets to big clear it
    watchn.watch(logfile, function (curr, prev, file, stats) {
      if (stats.size > 500) {
        fs.writeFileSync(logfile, '');
        sys.debug('Log File Cleared');
      }
    });
  }
  
  watch();
  
// -----------------------------------------------------------------------------

}());
