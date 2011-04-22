
var exec = require('child_process').exec;
var tests = './test/';
var libs = './lib/';

function notify(msg, growl) {
  console.log(msg);
  if (growl) {
    exec('growlnotify -name '+  growl.name + ' -m "' + growl.msg + '"');
  }
}

module.exports.init = function(watchn) {

  watchn.watch('build', [tests, libs], function(options) {
    if (options.curr > options.prev) {
      notify('-------------', {name: 'JavaScript', msg: 'Something'});
    }
  });
};


