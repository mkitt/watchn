
watchn.watch('sass', [styles], function(options) {
  watchn.execute('make sass', options, 'sass', false, true)
})

