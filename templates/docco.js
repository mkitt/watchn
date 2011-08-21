
watchn.watch('docs', [libs], function(options) {
  if (options.curr > options.prev) {
    exec('make docs', function(error, stdout, stderr) {

      if (error !== null)
        notify(error.message, {name: 'Docs', msg: 'Build Failed!'});
      else
        notify('docs generated');
    });
  }
});

