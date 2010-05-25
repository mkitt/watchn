
(function () {
  require.paths.push('./lib');
  var assert = require('assertn'),
      dir = __dirname + '/';
  
  assert.addTestCase(dir + 'test-simple1');
  assert.addTestCase(dir + 'test-simple2');
  assert.startSuite('runner');

}());