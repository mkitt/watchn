
  watchn.watch('styles', ['stylesheets/'], function(options) {
    if (options.curr > options.prev) {
      exec('make styles', function(error, stdout, stderr) {

        if (error !== null)
          notify(error.message, {name: 'Stylus', msg: 'Build Failed!'});
        else
          notify('styles generated');

      });
    }
  });
