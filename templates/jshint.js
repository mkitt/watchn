
watchn.watch('jshint', [libs, tests], function(options) {
  watchn.execute('make jshint', options, 'jshint', false, true)
})

