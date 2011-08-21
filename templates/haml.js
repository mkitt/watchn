
watchn.watch('markup', ['views/'], function(options) {
  if (options.curr > options.prev) {
    exec('make haml', function(error, stdout, stderr) {

      if (error !== null)
        notify(error.message, {name: 'HAML', msg: 'Build Failed!'});
      else
        notify('markup generated');
    });
  }
});

