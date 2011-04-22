
  watchn.watch('markup', ['views/'], function(options) {
    if (options.curr > options.prev) {
      exec('make jade', function(error, stdout, stderr) {

        if (error !== null)
          notify(error.message, {name: 'Jade', msg: 'Build Failed!'});
        else
          notify('markup generated');
      });
    }
  });

