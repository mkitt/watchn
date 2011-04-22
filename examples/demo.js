
var exec = require('child_process').exec;
var tests = './test/';
var libs = './lib/';
var publics = './examples/public/';
var demo = './examples/demo.js';


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

  watchn.watch('styles', [publics + 'stylesheets/'], function(options) {
    if (options.curr > options.prev) {
      exec('make css', function(error, stdout, stderr) {

        if (error !== null)
          notify(error.message, {name: 'Stylus', msg: 'Build Failed!'});
        else
          notify('styles generated');

      });
    }
  });

  watchn.watch('markup', [publics + 'views/'], function(options) {
    if (options.curr > options.prev) {
      exec('make html', function(error, stdout, stderr) {

        if (error !== null)
          notify(error.message, {name: 'Jade', msg: 'Build Failed!'});
        else
          notify('markup generated');
      });
    }
  });

  watchn.watch('js', [publics + 'javascripts/src/'], function(options) {
    if (options.curr > options.prev) {
      exec('make js', function(error, stdout, stderr) {

        if (error !== null)
          notify(error.message, {name: 'JavaScript', msg: 'Build Failed!'});
        else
          notify('js generated');
      });
    }
  });

};

