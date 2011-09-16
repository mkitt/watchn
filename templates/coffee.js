
watchn.watch('coffee', [libs, tests], function(options) {
  watchn.execute('make coffee', options, 'coffee', false, true)
})

