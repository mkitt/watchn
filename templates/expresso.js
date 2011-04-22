
  watchn.watch('test', ['./test/', './lib/'], function(options) {
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
