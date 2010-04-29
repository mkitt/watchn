
(function () {
  require.paths.push('./lib');
  var watchn = require('watchn'),
      sys = require('sys'),
      spawn = require('child_process').spawn,
      monitor,
      id;

// abstract monit into the watchn module..
  function monit() {
    
    if (monitor && monitor.pid === id) {
      monitor.kill('SIGTERM');
    }
    
    monitor = spawn('node', ['test/test.js']);    
    id = monitor.pid;
    
    monitor.stdout.addListener('data', function (data) {
      sys.print(data);
    });
    
    monitor.stderr.addListener('data', function (data) {
      sys.print('Error: ' + data);
    });
    
    monitor.addListener('exit', function (code) {
      sys.puts('child process exited with code: ' + code);
    });
  }
  
// ----------------------------------------------------------------------------

  watchn.help();
  
// need to refactor once monit is abstracted into the watchn module..
  watchn.watch(__dirname + '/lib', function (curr, prev) {
    sys.debug(curr.mtime + ' => ' + prev.mtime);
    monit();
  });
  
}());

