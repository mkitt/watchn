
(function () {
  require.paths.push('./lib');
  var watchn = require('watchn'),
      sys = require('sys');

  watchn.help();
  
  watchn.watch(__dirname + '/lib', function (curr, prev) {
    watchn.action({env: 'node', program: __dirname + '/test/test.js'});
  });  
  
}());

