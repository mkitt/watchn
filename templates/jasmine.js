
watchn.watch('test', [tests, libs], function(options) {
  watchn.execute('make test', options, 'jasmine', false, true)
})

