
(function () {
  require.paths.push('./lib');
  var watchn = require('watchn'),
      sys = require('sys');
  
  function onTestProgress(data) {
    sys.print(data);
  }
  
  function onTestComplete(code, monitor) {
    sys.debug('--- onTestComplete ---');
  }
  
  function watch() {
    var test = __dirname + '/test/test.js';
    watchn.watch(__dirname + '/lib', function (curr, prev) {
      watchn.action({env: 'node', program: test, stdout: onTestProgress, exit: onTestComplete});
    });
  }
  
  watchn.help();
  watch();
  
}());
