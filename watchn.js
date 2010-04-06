require.paths.push('./lib');

var watchn = require('watchn'),
    sys = require('sys');

watchn.help();

watchn.watch(__dirname + '/test/helpers', function(curr, prev) {
  sys.debug(curr.mtime + ' => ' + prev.mtime);
});
