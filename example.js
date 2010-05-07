
(function () {
  require.paths.push('./lib');
  var watchn = require('watchn'),
      sys = require('sys');
  
  function onTestProgress(data) {
    sys.print(data);
  }
  
  function onTestComplete(code, monitor) {
    sys.puts('--- onTestComplete ---');
  }
  
  function watch() {
    var testfile = __dirname + '/test/test.js',
        testprog = {env: 'node', program: testfile, stdout: onTestProgress, exit: onTestComplete};
    
    watchn.initialize();
    
    watchn.watch(testfile, function (curr, prev) {
      watchn.action(testprog);
    });
    
    watchn.watch(__dirname + '/lib', function (curr, prev) {
      watchn.action(testprog);
    });
    
  }
  
  watch();
  
}());
