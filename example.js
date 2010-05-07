
(function () {
  require.paths.push('./lib');
  var watchn = require('watchn'),
      sys = require('sys'),
      log = '';
  
  function onTestProgress(data) {
    log = data;
    sys.print(data);
  }
  
  function onTestComplete(code, monitor) {
    sys.debug('Log is ' + log);
  }
  
  watchn.help();
  
  watchn.watch(__dirname + '/lib', function (curr, prev) {
    watchn.action({env: 'node', program: __dirname + '/test/test.js', stdout: onTestProgress, exit: onTestComplete});
  });
  
}());
