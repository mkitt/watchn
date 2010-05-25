
(function () {
  require.paths.push('./lib');
  var watchn = require('watchn'),
      sys = require('sys');

// ----------------------------------------------------------------------------
  
  function reload() {
    watchn.reload();
  }
  
// ----------------------------------------------------------------------------

  function onTestProgress(data) {
    sys.print(data);
  }
  
  function onTestComplete(code, monitor) {
    sys.puts('=> Exited with Code: ' + code + ' <=');
    reload();
  }
  
  function runTestSuite(code, monitor) {
    var env = 'node',
        stdout = onTestProgress,
        exit = onTestComplete,
        runner = './examples/test/runner.js';
        
    if (code === 0) {
      watchn.action({env: env, program: runner, stdout: stdout, exit: exit});
    } else {
      sys.debug('Test Failed');
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

// ----------------------------------------------------------------------------
  
  function watch() {
    var testdir = './examples/test/';
    
    watchn.initialize(watch);
    
    watchn.watch(testdir, function (curr, prev, file, stats) {
      runTest(curr, prev, file, stats);
    });
        
    // watchn.watch('./examples/lib', function (curr, prev, file) {
    //   watchn.action(testprog);
    // });
        
  }
  
  watch();
  
// ----------------------------------------------------------------------------  

}());
