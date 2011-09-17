
watchn.watch('vows', [libs, tests], function(options) {
  watchn.execute('make vows', options, 'vows', true, true)
})

