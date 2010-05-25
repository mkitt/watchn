
(function () {
  require.paths.push('./lib');
  var watchn = require('watchn'),
      fs = require('fs'),
      sys = require('sys'),
      params = process.argv.splice(2);

// ----------------------------------------------------------------------------
  
  function onTestProgress(data) {
    sys.print(data);
  }
  
  function onTestComplete(code, monitor) {
    sys.puts('---------- Exited with Code: ' + code + ' ----------');
  }

// ----------------------------------------------------------------------------
  
  function watch() {
    var testfile = './examples/test/test-simple.js',
        testprog = {env: 'node', 
                    program: testfile, 
                    stdout: onTestProgress, 
                    exit: onTestComplete};
    
    watchn.initialize(watch);
    
    watchn.watch(testfile, function (curr, prev, file) {
      watchn.action(testprog);
    });
        
    watchn.watch('./examples/lib', function (curr, prev, file) {
      watchn.action(testprog);
    });
        
  }
  
  watch();
  
// ----------------------------------------------------------------------------  

}());
