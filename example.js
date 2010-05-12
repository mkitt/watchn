
(function () {
  require.paths.push('./lib');
  var watchn = require('watchn'),
      sys = require('sys'),
      params = process.argv.splice(2);

// ----------------------------------------------------------------------------
  
  function onTestProgress(data) {
    sys.print(data);
  }
  
  function onTestComplete(code, monitor) {
    sys.puts('----------');
  }

// ----------------------------------------------------------------------------
  
  function watch() {
    var testfile = __dirname + '/test/test.js',
        testprog = {env: 'node', 
                    program: testfile, 
                    stdout: onTestProgress, 
                    exit: onTestComplete};
    
    watchn.initialize(watch);
    
    watchn.watch(testfile, function (curr, prev) {
      watchn.action(testprog);
    });
    
    watchn.watch(__dirname + '/lib', function (curr, prev) {
      watchn.action(testprog);
    });
    
  }
  
// ----------------------------------------------------------------------------  

  // todo: this should be refactored into the watchn module
  if (params.length > 0) {
    params.forEach(function (param) {
      if (param === 'help' || param === '--help' || param === '-h') {
        watchn.help();
      }
    });
    
  } else {
    watch();
  }
  
// ----------------------------------------------------------------------------  

}());
