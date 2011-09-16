
watchn.watch('test', [tests, libs], function(options) {
  watchn.execute('make test', options, 'expresso', false, true)
})

