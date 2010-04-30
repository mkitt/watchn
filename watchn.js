
(function () {
  require.paths.push('./lib');
  var watchn = require('watchn'),
      sys = require('sys');

  watchn.help();
  
  watchn.watch(__dirname + '/lib', function (curr, prev) {
    // watchn.action('ruby', __dirname + '/ruby.rb');
    watchn.action('node', __dirname + '/test/test.js');
  });  
  
}());

