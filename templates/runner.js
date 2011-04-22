
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

  watchn.watch('test', [tests, libs], function(options) {
    if (options.curr > options.prev) {
      exec('make test', function(error, stdout, stderr) {
        var gmsg = watchn.trim(watchn.trimANSI(stderr));

        if (error !== null) {
          gmsg = 'Test ' + gmsg.substr(gmsg.search(/(failures)/i));
          notify(stderr, {name: 'Expresso', msg: gmsg});

        } else {
          var cmsg = watchn.trim(watchn.trimNewlines(stderr));
          notify(cmsg, {name: 'Expresso', msg: gmsg + ' passed'});
        }
      });
    }
  });

};

