
var exec = require('child_process').exec;
var tests = './test/';
var libs = './lib/';


function notify(msg, growl) {
  console.log(new Date() + ': ' + msg);
  if (growl) {
    exec('growlnotify -name '+  growl.name + ' -m "' + growl.msg + '"');
  }
}

module.exports.init = function(watchn) {

  watchn.watch('test', [tests, libs], function(options) {
    if (options.curr > options.prev) {
      exec('make test', function(error, stdout, stderr) {

        if (error !== null)
          notify(error.message, {name: 'Tests', msg: 'Tests Failed!'});
        else
          notify('tests passed');
      });
    }
  });

};

