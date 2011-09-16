
watchn.watch('scss', [styles], function(options) {
  watchn.execute('make scss', options, 'scss', false, true)
})

